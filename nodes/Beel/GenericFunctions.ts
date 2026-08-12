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
import { NodeApiError } from 'n8n-workflow';

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

/** Header that designates which company (NIF) an account-wide key operates as. */
const ACTIVE_COMPANY_HEADER = 'Beel-Active-Company';

/**
 * Performs an authenticated request against the BeeL Public API.
 *
 * Adds an `Idempotency-Key` to every POST so a retried request never creates a
 * duplicate invoice, and sets the active-company header so multi-NIF accounts
 * operate as the intended company.
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

	// A company chosen on the node overrides the account default in the credential.
	const activeProfile = (companyId || ((credentials.companyId as string) ?? '')).trim();
	if (activeProfile !== '') {
		headers[ACTIVE_COMPANY_HEADER] = activeProfile;
	}

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
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

// ── Dropdowns ───────────────────────────────────────────────────────────────

/** Companies (NIFs) the API key can operate as. */
export async function getCompanies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	// El plano `GET /v1/companies` fue RETIRADO del contrato (multi-NIF: los
	// recursos de cuenta viven bajo /v1/accounts/{account_id}/...). El account_id
	// de la credencial se descubre con /v1/me/identity, que sí admite API key.
	const identity = (await beelApiRequest.call(this, 'GET', '/v1/me/identity')) as IBeelEnvelope;
	const accountId = ((identity?.data as IDataObject)?.account_id ?? '') as string;

	const response = (await beelApiRequest.call(
		this,
		'GET',
		`/v1/accounts/${accountId}/companies`,
	)) as IBeelEnvelope;

	const data = response?.data;
	const companies = (
		Array.isArray(data) ? data : ((data as IDataObject)?.companies ?? [])
	) as IDataObject[];

	return companies.map((company) => ({
		name: `${(company.legal_name ?? company.name) as string}${company.nif ? ` — ${company.nif as string}` : ''}`,
		value: company.id as string,
	}));
}

/** Active invoice series, for the series pickers. */
export async function getSeries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = (await beelApiRequest.call(
		this,
		'GET',
		'/v1/configuration/series',
		undefined,
		{ active: true },
		currentCompanyId(this),
	)) as IBeelEnvelope;

	const series = (response?.data ?? []) as IDataObject[];

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
		'/v1/customers',
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
		'/v1/products',
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
		name: 'Invoice Cancelled',
		value: 'invoice.cancelled',
		description: 'An invoice was cancelled',
	},
	{ name: 'Invoice Emitted', value: 'invoice.emitted', description: 'An invoice was emitted and finalised' },
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
];
