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
import { NodeApiError, NodeOperationError, sleep } from 'n8n-workflow';

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
 * What the caller knows about the scope of this request.
 *
 * Both axes follow the same rule: what the node was told wins, and what the
 * credential or the API key implies is the fallback. A bare string is read as
 * the company, which is how most call sites still spell it.
 */
export interface BeelScope {
	/** Company (NIF) chosen on the node. */
	companyId?: string;
	/**
	 * Account chosen on the node. Empty means the account the API key belongs to.
	 *
	 * A provisioner operates on accounts it created, not only its own — the
	 * contract is explicit that `account_id` "may be your own account or an
	 * account you provisioned" — so a tax advisory firm has to be able to name one.
	 */
	accountId?: string;
}

function asScope(scope: string | BeelScope): BeelScope {
	return typeof scope === 'string' ? { companyId: scope } : scope;
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
	(context: BeelRequestContext, scope: BeelScope) => Promise<string>
> = {
	async company_id(context, scope) {
		const credentials = await context.getCredentials('beelApi');
		// A company chosen on the node overrides the account default in the credential.
		const company = ((scope.companyId ?? '') || ((credentials.companyId as string) ?? '')).trim();

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

	async account_id(context, scope) {
		// An account named on the node wins; otherwise the key's own account.
		const chosen = (scope.accountId ?? '').trim();
		if (chosen !== '') return chosen;

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
	scope: BeelScope,
): Promise<string> {
	let path = endpoint;

	for (const axis of scopeAxesOf(endpoint)) {
		const value = await SCOPE_RESOLVERS[axis.parameter](this, scope);
		path = path.replace(placeholderOf(axis), encodeURIComponent(value));
	}

	return path;
}

/**
 * The Idempotency-Key header, validated before it leaves n8n.
 *
 * This header is added here rather than declared by the contract, so it is the
 * one value in the node that the generated validation never sees. The API
 * requires a UUID or a plain alphanumeric string, and rejects anything else with
 * a 400 — which is how a perfectly reasonable-looking key built from a
 * timestamp (`2026-08-20T15:42:39.123Z`, full of `:` and `.`) fails only once
 * the invoice request is already in flight.
 *
 * Everywhere else the node reports a bad value before sending. This does too.
 */
function checkedIdempotencyKey(this: BeelRequestContext, supplied: string): string {
	const key = supplied.trim();
	if (key === '') return randomUUID();

	if (!/^[A-Za-z0-9-]+$/.test(key) || key.length > 255) {
		throw new NodeOperationError(this.getNode(), 'The idempotency key has characters BeeL will reject', {
			description:
				'It must be a UUID or plain alphanumeric text — no spaces, colons or dots. A timestamp like ' +
				'"2026-08-20T15:42:39.123Z" fails for that reason; strip the separators, for example with ' +
				'<code>.replace(/[^a-zA-Z0-9]/g, "")</code>.',
		});
	}

	return key;
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
	scope: string | BeelScope = '',
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
		headers['Idempotency-Key'] = checkedIdempotencyKey.call(this, idempotencyKey);
	}

	const url = `${baseUrl}${await resolveScope.call(this, endpoint, asScope(scope))}`;

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

	// On 429 the API answers Retry-After with exactly how long to wait. Without
	// this, a long "Return All" died mid-pagination and lost all its progress. The
	// retry count is bounded so a workflow can never hang on it.
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
				await sleep(waitMs);
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
 * Pulls the list out of a response envelope, tolerating a contract that got the
 * shape wrong.
 *
 * `listKey` comes from the contract, and the contract can be mistaken:
 * `GET /v1/accounts/{account_id}/companies` declares `data` as an array while the
 * API returns `data.companies[]`, so the node listed ZERO companies — behind a
 * 200, with no error at all. Stub-based tests could not see it, because they
 * answer what the contract says.
 *
 * So when the declared key is absent, the first array inside `data` is used
 * rather than silently returning an empty list.
 */
function itemsOf(data: unknown, listKey: string): IDataObject[] {
	if (Array.isArray(data)) return data as IDataObject[];
	if (data === null || typeof data !== 'object') return [];

	const envelope = data as IDataObject;
	const declared = listKey === '' ? undefined : envelope[listKey];
	if (Array.isArray(declared)) return declared as IDataObject[];

	const found = Object.values(envelope).find(Array.isArray);
	return (found ?? []) as IDataObject[];
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
	scope: string | BeelScope = '',
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
			scope,
		)) as IBeelEnvelope;

		const data = response?.data;
		const items = itemsOf(data, listKey);

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

/** Both scope axes as this item set them; empty values fall back downstream. */
export function resolveScopeFor(context: IExecuteFunctions, itemIndex: number): BeelScope {
	return {
		companyId: resolveCompanyId(context, itemIndex),
		accountId: ((context.getNodeParameter('activeAccount', itemIndex, '') as string) ?? '').trim(),
	};
}

/** A node parameter as seen from a dropdown that is being populated. */
function currentParameter(context: ILoadOptionsFunctions, name: string): string {
	try {
		return ((context.getCurrentNodeParameter(name) as string) ?? '').trim();
	} catch {
		// getCurrentNodeParameter throws during editor configuration when the parameter is not yet
		// available; return an empty string so the dropdown loads without a pre-fill.
		return '';
	}
}

/** Both scope axes as the editor currently has them, for the dropdown loaders. */
function currentScope(context: ILoadOptionsFunctions): BeelScope {
	return {
		companyId: currentParameter(context, 'activeCompany'),
		accountId: currentParameter(context, 'activeAccount'),
	};
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
 * Each credential's account_id, memoised for the life of the process. It is
 * stable per API key, so `/v1/me/identity` is asked ONCE per credential rather
 * than on every dropdown load and every execution.
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
	// The flat `GET /v1/companies` was withdrawn from the contract: with multi-NIF,
	// account resources live under /v1/accounts/{account_id}/... The list is always
	// paginated — there is no "all" mode, since it scales to thousands of NIFs.
	const companies = await beelApiRequestAllItems.call(
		this,
		'companies',
		contractPath('listCompanies'),
		{},
		300,
		currentScope(this),
	);

	return companies.map((company) => ({
		name: `${(company.legal_name ?? company.name) as string}${company.nif ? ` — ${company.nif as string}` : ''}`,
		value: company.id as string,
	}));
}

/**
 * Accounts this API key can act on: its own, plus any it provisioned.
 *
 * Only a provisioner key sees more than one, so on an ordinary key this list
 * has a single entry and the field can be left alone.
 */
export async function getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accounts = await beelApiRequestAllItems.call(
		this,
		'accounts',
		contractPath('listAccounts'),
		{},
		300,
	);

	return accounts.map((account) => ({
		name: `${(account.legal_name ?? account.name ?? account.email ?? account.id) as string}`,
		value: account.id as string,
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
		currentScope(this),
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
		currentScope(this),
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
		currentScope(this),
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
