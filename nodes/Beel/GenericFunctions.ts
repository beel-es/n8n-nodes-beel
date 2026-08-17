import { randomUUID } from 'crypto';

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { CONTRACT_PATHS } from './descriptions/generated/operations.generated';
import { placeholderOf, scopeAxesOf } from './scope';
import type { ScopeParameter } from './scope';

export type BeelRequestContext =
	| IExecuteFunctions
	| ILoadOptionsFunctions
	| IHookFunctions
	| IWebhookFunctions;

/**
 * The BeeL API wraps every successful payload in `{ data: ..., meta: ... }`.
 * List endpoints put the array either directly in `data` or under a named key
 * (`data.invoices`, `data.customers`, ...), with `pagination` next to it.
 */
export interface IBeelEnvelope {
	data?: unknown;
	meta?: IDataObject;
	pagination?: IDataObject;
}

/**
 * Resolves each scope axis to the value that replaces its placeholder.
 *
 * Keyed by `ScopeParameter`, so adding an axis in `scope.ts` fails to compile
 * until it has a resolver here — which beats discovering at runtime that a new
 * placeholder travelled to the API unsubstituted.
 */
const SCOPE_RESOLVERS: Record<
	ScopeParameter,
	(context: BeelRequestContext, companyId: string) => Promise<string>
> = {
	async company_id(context, companyId) {
		const credentials = await context.getCredentials('beelApi');
		// A company chosen on the node overrides the account default in the credential.
		const company = (companyId || ((credentials.companyId as string) ?? '')).trim();

		if (company === '') {
			throw new NodeOperationError(
				context.getNode(),
				'This operation needs a company: BeeL scopes it by NIF',
				{
					description:
						'Pick one in the node\'s "Company" field, or set a default company on the BeeL credential.',
				},
			);
		}

		return company;
	},

	async account_id(context) {
		const accountId = await resolveAccountId.call(context);

		if (accountId === '') {
			throw new NodeOperationError(
				context.getNode(),
				'BeeL did not return an account for this API key',
				{ description: 'GET /v1/me/identity answered without an account_id.' },
			);
		}

		return accountId;
	},
};

/** Substitutes the scope placeholders the path opens with. */
async function resolveScope(
	this: BeelRequestContext,
	endpoint: string,
	companyId: string,
): Promise<string> {
	let path = endpoint;

	for (const axis of scopeAxesOf(endpoint)) {
		const value = await SCOPE_RESOLVERS[axis.parameter](this, companyId);
		path = path.replace(placeholderOf(axis), encodeURIComponent(value));
	}

	return path;
}

/**
 * Performs an authenticated request against the BeeL Public API.
 *
 * Adds an `Idempotency-Key` to every POST so a retried request never creates a
 * duplicate invoice, and fills in the scope the path asks for: `{company_id}`
 * from the company chosen on the node (or the credential default), and
 * `{account_id}` from the API key's own identity.
 *
 * The scope used to travel in a `Beel-Active-Company` header. The contract
 * retired it — `{company_id}` in the path is now the only source of context, and
 * the account that owns it is derived from it — so a request that reached the
 * API with the header and no company in the path would silently operate on
 * whichever company the key defaults to. Resolving it here means the generated
 * operations, the hand-written file operations and the dropdowns all get it.
 */
export async function beelApiRequest(
	this: BeelRequestContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | undefined = undefined,
	qs: IDataObject = {},
	companyId = '',
	option: Partial<IHttpRequestOptions> = {},
	idempotencyKey = '',
): Promise<any> {
	const credentials = await this.getCredentials('beelApi');
	const baseUrl = ((credentials.baseUrl as string) || 'https://app.beel.es/api').replace(/\/+$/, '');

	const headers: IDataObject = { Accept: 'application/json' };

	if (method === 'POST') {
		// A random key makes a transport-level retry safe. A key the workflow author
		// supplies goes further: re-running the workflow returns the invoice already
		// created for that key instead of issuing a second one.
		headers['Idempotency-Key'] = idempotencyKey.trim() || randomUUID();
	}

	const url = `${baseUrl}${await resolveScope.call(this, endpoint, companyId)}`;

	const options: IHttpRequestOptions = {
		method,
		url,
		headers,
		json: true,
		...option,
	};

	// The API rejects POST/PUT/PATCH without a JSON body — unless the caller
	// already supplied one, as the multipart upload does.
	if (['POST', 'PUT', 'PATCH'].includes(method) && option.body === undefined) {
		options.body = body ?? {};
	}

	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	// 429: la API responde Retry-After con los segundos exactos a esperar. Sin
	// esto, un "Return All" largo moría a mitad de paginación perdiendo todo el
	// progreso. Tope de reintentos acotado para no colgar workflows.
	const MAX_RATE_LIMIT_RETRIES = 3;
	for (let attempt = 0; ; attempt++) {
		try {
			return await this.helpers.httpRequestWithAuthentication.call(this, 'beelApi', options);
		} catch (error) {
			const status = Number(
				(error as IDataObject)?.httpCode ?? (error as IDataObject)?.statusCode ?? 0,
			);
			if (status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
				const retryAfter = Number(
					((error as IDataObject)?.response as IDataObject | undefined)?.headers?.[
						'retry-after' as never
					] ?? 0,
				);
				const waitMs = (retryAfter > 0 && retryAfter <= 120 ? retryAfter : 2 ** attempt + 1) * 1000;
				await new Promise((resolve) => setTimeout(resolve, waitMs));
				continue;
			}
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: extractErrorMessage(error),
			});
		}
	}
}

/** Pulls the human-readable message out of a BeeL error envelope. */
function extractErrorMessage(error: unknown): string | undefined {
	const response = (error as IDataObject)?.error ?? (error as IDataObject)?.response;
	const payload = ((response as IDataObject)?.error ?? response) as IDataObject | undefined;
	const message = payload?.message;
	return typeof message === 'string' ? message : undefined;
}

/** Returns `envelope.data`, unwrapped, or the raw response when there is no envelope. */
export function unwrap(response: IBeelEnvelope | undefined): IDataObject {
	if (response === undefined || response === null) return {};
	const data = response.data;
	if (data === undefined) return response as IDataObject;
	return (data ?? {}) as IDataObject;
}

/**
 * Walks a paginated BeeL list endpoint.
 *
 * @param listKey Key holding the array inside `data`; empty when `data` is the array.
 * @param limit   Maximum number of items to return; `0` means every page.
 */
export async function beelApiRequestAllItems(
	this: BeelRequestContext,
	listKey: string,
	endpoint: string,
	qs: IDataObject = {},
	limit = 0,
	companyId = '',
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];
	const pageSize = limit > 0 && limit < 100 ? limit : 100;

	let page = 1;
	let totalPages = 1;

	do {
		const response = (await beelApiRequest.call(
			this,
			'GET',
			endpoint,
			undefined,
			{ ...qs, page, limit: pageSize },
			companyId,
		)) as IBeelEnvelope;

		const data = response?.data;
		const items = (
			Array.isArray(data) ? data : ((data as IDataObject)?.[listKey] ?? [])
		) as IDataObject[];

		results.push(...items);

		if (items.length === 0) break;
		if (limit > 0 && results.length >= limit) break;

		const pagination = (
			Array.isArray(data) ? response?.pagination : (data as IDataObject)?.pagination
		) as IDataObject | undefined;

		totalPages = Number(pagination?.total_pages ?? page);
		page += 1;
	} while (page <= totalPages);

	return limit > 0 ? results.slice(0, limit) : results;
}

/** Company chosen on the node for this item, falling back to the credential default. */
export function resolveCompanyId(context: IExecuteFunctions, itemIndex: number): string {
	return ((context.getNodeParameter('activeCompany', itemIndex, '') as string) ?? '').trim();
}

/** Company chosen on the node, as seen from a dropdown that is being populated. */
function currentCompanyId(context: ILoadOptionsFunctions): string {
	try {
		return ((context.getCurrentNodeParameter('activeCompany') as string) ?? '').trim();
	} catch {
		return '';
	}
}

/**
 * The contract's path for an endpoint the hand-written code calls directly.
 *
 * Every such path is declared in `REFERENCED_OPERATION_IDS` and emitted by the
 * generator, so a route the API retires breaks `npm run generate` with the
 * endpoint to migrate, instead of shipping a URL that quietly 404s.
 */
export function contractPath(operationId: string): string {
	const path = CONTRACT_PATHS[operationId];
	if (path === undefined) {
		throw new Error(
			`"${operationId}" is not in CONTRACT_PATHS — add it to REFERENCED_OPERATION_IDS in scripts/config.ts and re-run \`npm run generate\`.`,
		);
	}
	return path;
}

// ── Dropdowns ───────────────────────────────────────────────────────────────

/**
 * account_id de cada credencial, memoizado para la vida del proceso: es estable
 * por API key, así que /v1/me/identity se consulta UNA vez por credencial, no
 * en cada carga del dropdown ni en cada ejecución.
 */
const accountIdByCredential = new Map<string, string>();

async function resolveAccountId(this: BeelRequestContext): Promise<string> {
	const credentials = await this.getCredentials('beelApi');
	const cacheKey = `${credentials.baseUrl ?? ''}:${credentials.apiKey as string}`;

	const cached = accountIdByCredential.get(cacheKey);
	if (cached) return cached;

	const identity = (await beelApiRequest.call(
		this,
		'GET',
		contractPath('getMyIdentity'),
	)) as IBeelEnvelope;
	const accountId = ((identity?.data as IDataObject)?.account_id ?? '') as string;
	if (accountId) accountIdByCredential.set(cacheKey, accountId);
	return accountId;
}

/** Companies (NIFs) the API key can operate as. */
export async function getCompanies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	// El plano `GET /v1/companies` fue RETIRADO del contrato (multi-NIF: los
	// recursos de cuenta viven bajo /v1/accounts/{account_id}/...). La lista está
	// siempre paginada: no hay modo "todo", escala a miles de NIFs.
	const companies = await beelApiRequestAllItems.call(
		this,
		'companies',
		contractPath('listCompanies'),
		{},
		300,
	);

	return companies.map((company) => ({
		name: `${(company.legal_name ?? company.name) as string}${company.nif ? ` — ${company.nif as string}` : ''}`,
		value: company.id as string,
	}));
}

/** Active invoice series, for the series pickers. */
export async function getSeries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	// `data` is the array itself here, so the list key is empty.
	const series = await beelApiRequestAllItems.call(
		this,
		'',
		contractPath('listCompanySeries'),
		{ active: true },
		300,
		currentCompanyId(this),
	);

	return series.map((item) => ({
		name: `${item.name as string} (${item.code as string})`,
		value: item.id as string,
		description: item.default_series === true ? 'Default series' : undefined,
	}));
}

/** Registered customers, for the recipient pickers. */
export async function getCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const customers = await beelApiRequestAllItems.call(
		this,
		'customers',
		contractPath('listCompanyCustomers'),
		{},
		300,
		currentCompanyId(this),
	);

	return customers.map((customer) => ({
		name: `${customer.legal_name as string}${customer.nif ? ` — ${customer.nif as string}` : ''}`,
		value: customer.id as string,
	}));
}

/** Catalogue products, for prefilling invoice lines. */
export async function getProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const products = await beelApiRequestAllItems.call(
		this,
		'products',
		contractPath('listCompanyProducts'),
		{},
		300,
		currentCompanyId(this),
	);

	return products.map((product) => ({
		name: `${product.name as string}${product.code ? ` (${product.code as string})` : ''}`,
		value: product.id as string,
	}));
}

/** Event types a webhook subscription can listen to, straight from the API. */
export async function getWebhookEvents(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	return WEBHOOK_EVENTS.map((event) => ({
		name: event.name,
		value: event.value,
		description: event.description,
	}));
}

/** Mirrors `WebhookEventTypeEnum` in openapi/public-api.yaml. */
export const WEBHOOK_EVENTS = [
	{
		name: 'Invoice Issued',
		value: 'invoice.issued',
		description: 'An invoice was issued (numbered and finalised)',
	},
	{
		name: 'Invoice Voided',
		value: 'invoice.voided',
		description: 'An issued invoice was voided',
	},
	{
		name: 'Invoice Email Sent',
		value: 'invoice.email.sent',
		description: 'An invoice was sent by email',
	},
	{
		name: 'VeriFactu Status Updated',
		value: 'verifactu.status.updated',
		description: 'AEAT accepted or rejected a VeriFactu submission',
	},
	{
		name: 'Recurring Invoice Paused',
		value: 'recurring_invoice.paused',
		description: 'A recurring invoice was paused (e.g. after repeated failures)',
	},
	{
		name: 'Account Claimed',
		value: 'account.claimed',
		description: 'A provisioned account was claimed by its holder',
	},
	{
		name: 'Company Created',
		value: 'company.created',
		description: 'A company (NIF) was registered in the account',
	},
	{
		name: 'Representation Signed',
		value: 'representation.signed',
		description: 'The VeriFactu representation document was signed',
	},
];
