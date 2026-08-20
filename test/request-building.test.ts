import { describe, expect, it } from 'vitest';

import { executeGeneratedOperation } from '../nodes/Beel/genericExecutor';
import {
	ACCOUNT_BASE,
	COMPANY_BASE,
	COMPANY_ID,
	CUSTOMER_ID,
	INVOICE_ID,
	SERIES_ID,
	makeContext,
	operationFor,
} from './helpers';

/**
 * The executor turns UI values into an HTTP request entirely from the metadata
 * generated off the contract, so these assert the request that comes out.
 */

async function run(resource: string, operation: string, options: Parameters<typeof makeContext>[0]) {
	const stub = makeContext(options);
	const result = await executeGeneratedOperation.call(
		stub.context,
		operationFor(resource, operation),
		0,
	);
	return { result, request: stub.requests[0], requests: stub.requests };
}

describe('building a request', () => {
	it('nests flattened fields back into the objects the API expects', async () => {
		const { request } = await run('invoice', 'create', {
			parameters: {
				type: 'STANDARD',
				recipient: { value: { customer_id: CUSTOMER_ID } },
				lines: {
					value: [
						{
							description: 'Sprint 1',
							quantity: 40,
							unit_price: 50,
							main_tax_type: 'IVA',
							main_tax_percentage_IVA: 21,
							main_tax_regime_key: '01',
							irpf_rate: 15,
						},
					],
				},
				additionalFields: { series_id: SERIES_ID, metadata: '{"order_id":"ORD-42"}' },
			},
		});

		expect(request.method).toBe('POST');
		expect(request.url).toBe(`${COMPANY_BASE}/invoices`);
		expect(request.body).toEqual({
			type: 'STANDARD',
			recipient: { customer_id: CUSTOMER_ID },
			lines: [
				{
					description: 'Sprint 1',
					quantity: 40,
					unit_price: 50,
					main_tax: { type: 'IVA', percentage: 21, regime_key: '01' },
					irpf_rate: 15,
				},
			],
			series_id: SERIES_ID,
			metadata: { order_id: 'ORD-42' },
		});
	});

	it('substitutes path parameters', async () => {
		const { request } = await run('invoice', 'void', {
			parameters: { invoiceId: INVOICE_ID, reason: 'Duplicada por error' },
		});

		expect(request.url).toBe(`${COMPANY_BASE}/invoices/${INVOICE_ID}/void`);
		expect(request.body).toEqual({ reason: 'Duplicada por error' });
	});

	it('substitutes a path parameter declared once for the whole path item', async () => {
		// Regression: these endpoints declare their parameters at path-item level
		// rather than per operation, and the URL used to go out with the
		// placeholder still in it.
		const { request } = await run('company', 'getRepresentationStatus', {
			parameters: { activeCompany: COMPANY_ID },
		});

		expect(request.url).toBe(`${COMPANY_BASE}/representation`);
	});

	it('separates query parameters from the body', async () => {
		// Product search is `?q=` on the list now that `/v1/products/search` is gone.
		const { request } = await run('product', 'getAll', {
			parameters: { returnAll: false, limit: 5, filters: { q: 'consult' } },
			responses: { data: { products: [], pagination: { total_pages: 1 } } },
		});

		expect(request.method).toBe('GET');
		expect(request.qs).toMatchObject({ q: 'consult', limit: 5 });
		expect(request.body).toBeUndefined();
	});

	it('honours the base URL from the credential', async () => {
		const { request } = await run('nif', 'validate', {
			parameters: { nif: 'B86561412' },
			credentials: { apiKey: 'beel_sk_test_x', baseUrl: 'https://test.beel.es/api/' },
		});

		expect(request.url).toBe('https://test.beel.es/api/v1/nif/validate');
	});
});

describe('values the user never chose', () => {
	it('leaves out an untouched address and alternative ID', async () => {
		// n8n fills every field of a collection with its default as soon as the
		// collection exists, so picking a customer used to ship a half-built address
		// (country code "ES") and alternative_id (type "02"), and the API rejected the
		// invoice for the fields it was never given.
		const { request } = await run('invoice', 'create', {
			parameters: {
				type: 'STANDARD',
				recipient: {
					value: {
						customer_id: CUSTOMER_ID,
						address_country: '',
						address_country_code: 'ES',
						address_street: '',
						address_number: '',
						address_postal_code: '',
						address_city: '',
						address_province: '',
						alternative_id_type: '02',
						alternative_id_number: '',
					},
				},
				lines: { value: [{ description: 'x', quantity: 1, unit_price: 10 }] },
				additionalFields: {},
			},
		});

		expect(request.body).toMatchObject({ recipient: { customer_id: CUSTOMER_ID } });
		expect((request.body as Record<string, Record<string, unknown>>).recipient).not.toHaveProperty(
			'address',
		);
		expect((request.body as Record<string, Record<string, unknown>>).recipient).not.toHaveProperty(
			'alternative_id',
		);
	});

	it('sends the whole address when the recipient is filled inline', async () => {
		const { request } = await run('invoice', 'create', {
			parameters: {
				type: 'STANDARD',
				recipient: {
					value: {
						legal_name: 'Acme SL',
						nif: 'B86561412',
						address_street: 'Calle Mayor',
						address_number: '1',
						address_postal_code: '28001',
						address_city: 'Madrid',
						address_province: 'Madrid',
						address_country: 'España',
						address_country_code: 'ES',
					},
				},
				lines: { value: [{ description: 'x', quantity: 1, unit_price: 10 }] },
				additionalFields: {},
			},
		});

		expect((request.body as Record<string, Record<string, unknown>>).recipient.address).toEqual({
			street: 'Calle Mayor',
			number: '1',
			postal_code: '28001',
			city: 'Madrid',
			province: 'Madrid',
			country: 'España',
			country_code: 'ES',
		});
	});

	/**
	 * Opening an invoice's "Options" collection and touching nothing materialised
	 * `email_config.recipients` as `[]`, and validation then rejected the whole
	 * invoice for "needs at least 1 value" — from a group nobody filled in.
	 *
	 * An untouched list means "not provided", not "provided badly".
	 */
	it('leaves out an email config nobody filled in', async () => {
		const { request } = await run('invoice', 'create', {
			parameters: {
				type: 'STANDARD',
				recipient: { value: { customer_id: CUSTOMER_ID } },
				lines: { value: [{ description: 'x', quantity: 1, unit_price: 10 }] },
				additionalFields: {
					options: {
						value: {
							email_config_recipients: [],
							email_config_cc: [],
							email_config_subject: '',
							email_config_message: '',
						},
					},
				},
			},
		});

		const options = (request.body as Record<string, Record<string, unknown>>).options;
		expect(options ?? {}).not.toHaveProperty('email_config');
	});

	it('still sends the email config when it does have recipients', async () => {
		const { request } = await run('invoice', 'create', {
			parameters: {
				type: 'STANDARD',
				recipient: { value: { customer_id: CUSTOMER_ID } },
				lines: { value: [{ description: 'x', quantity: 1, unit_price: 10 }] },
				additionalFields: {
					options: {
						value: {
							email_config_recipients: ['cliente@example.com'],
							email_config_cc: [],
							email_config_subject: 'Tu factura',
							email_config_message: '',
						},
					},
				},
			},
		});

		const options = (request.body as Record<string, Record<string, any>>).options;
		expect(options.email_config).toEqual({
			recipients: ['cliente@example.com'],
			subject: 'Tu factura',
		});
	});

	it('says which fields are missing when an address is half filled', async () => {
		await expect(
			run('invoice', 'create', {
				parameters: {
					type: 'STANDARD',
					recipient: { value: { legal_name: 'Acme SL', address_street: 'Calle Mayor' } },
					lines: { value: [{ description: 'x', quantity: 1, unit_price: 10 }] },
					additionalFields: {},
				},
			}),
		).rejects.toThrow(/missing required address fields/);
	});

	/**
	 * The API accepts EXACTLY ONE of unit_price / total_excluding_tax /
	 * total_including_tax, but the contract only says so in prose: the server is
	 * what enforces it.
	 *
	 * n8n materialises every field of the collection with its default, and a
	 * number's default is 0 — a legitimate value, so it cannot just be dropped.
	 * All three went out at once and the API rejected the invoice. A selector now
	 * decides which one is shown, so sending two is no longer possible.
	 */
	it('sends exactly one of the three ways of stating a line price', async () => {
		const line = (mode: string, extra: Record<string, unknown>) => ({
			description: 'x', quantity: 1,
			price_mode: mode, unit_price: 0, total_excluding_tax: 0, total_including_tax: 0,
			...extra,
		});

		for (const [mode, kept] of [
			['unit_price', 'unit_price'],
			['total_excluding_tax', 'total_excluding_tax'],
			['total_including_tax', 'total_including_tax'],
		] as const) {
			const { request } = await run('invoice', 'create', {
				parameters: {
					type: 'STANDARD',
					recipient: { value: { customer_id: CUSTOMER_ID } },
					lines: { value: [line(mode, { [kept]: 100 })] },
					additionalFields: {},
				},
			});

			const sent = (request.body as Record<string, Array<Record<string, unknown>>>).lines[0];
			const present = ['unit_price', 'total_excluding_tax', 'total_including_tax'].filter(
				(f) => sent[f] !== undefined,
			);

			expect(present).toEqual([kept]);
			// The selector steers the form; it is not a field of the API.
			expect(sent).not.toHaveProperty('price_mode');
		}
	});

	it('only sends the tax rate of the chosen tax type', async () => {
		const { request } = await run('invoice', 'create', {
			parameters: {
				type: 'STANDARD',
				recipient: { value: { customer_id: CUSTOMER_ID } },
				lines: {
					value: [
						{
							description: 'Canarias',
							quantity: 1,
							unit_price: 100,
							main_tax_type: 'IGIC',
							main_tax_percentage_IVA: 21,
							main_tax_percentage_IGIC: 7,
							main_tax_percentage_IPSI: 10,
						},
					],
				},
				additionalFields: {},
			},
		});

		const lines = (request.body as Record<string, Array<Record<string, unknown>>>).lines;
		expect(lines[0].main_tax).toEqual({ type: 'IGIC', percentage: 7 });
	});

	it('omits an optional enum left at "not set"', async () => {
		const { request } = await run('invoice', 'create', {
			parameters: {
				type: 'STANDARD',
				recipient: { value: { customer_id: CUSTOMER_ID } },
				lines: {
					value: [
						{
							description: 'x',
							quantity: 1,
							unit_price: 10,
							main_tax_type: 'IVA',
							main_tax_percentage_IVA: 21,
							exemption_reason: '',
							irpf_rate: '',
						},
					],
				},
				additionalFields: {},
			},
		});

		const lines = (request.body as Record<string, Array<Record<string, unknown>>>).lines;
		expect(lines[0]).not.toHaveProperty('exemption_reason');
		expect(lines[0]).not.toHaveProperty('irpf_rate');
	});
});

/**
 * The scope used to be a `Beel-Active-Company` header. The contract retired it:
 * `{company_id}` in the path is the only source of context. These cover the
 * substitution, because getting it wrong is silent — a literal `{company_id}`
 * in a URL is a 404, and the wrong company is worse than that.
 */
describe('scoping', () => {
	it('puts the company chosen on the node into the path', async () => {
		const { request } = await run('customer', 'getAll', {
			parameters: { activeCompany: COMPANY_ID, returnAll: false, limit: 10, filters: {} },
			responses: { data: { customers: [], pagination: { total_pages: 1 } } },
		});

		expect(request.url).toBe(`${COMPANY_BASE}/customers`);
	});

	it('falls back to the company set on the credential', async () => {
		const { request } = await run('customer', 'get', {
			parameters: { customerId: CUSTOMER_ID },
			credentials: { apiKey: 'beel_sk_test_x', companyId: COMPANY_ID },
		});

		expect(request.url).toBe(`${COMPANY_BASE}/customers/${CUSTOMER_ID}`);
	});

	it('prefers the company on the node over the credential default', async () => {
		const other = '11111111-2222-3333-4444-555555555555';
		const { request } = await run('customer', 'get', {
			parameters: { customerId: CUSTOMER_ID, activeCompany: other },
			credentials: { apiKey: 'beel_sk_test_x', companyId: COMPANY_ID },
		});

		expect(request.url).toBe(`https://app.beel.es/api/v1/companies/${other}/customers/${CUSTOMER_ID}`);
	});

	it('refuses to send a company-scoped request with no company', async () => {
		await expect(
			run('customer', 'get', {
				parameters: { customerId: CUSTOMER_ID },
				credentials: { apiKey: 'beel_sk_test_x' },
			}),
		).rejects.toThrow(/needs a company/);
	});

	it('resolves the account from the API key for account-scoped paths', async () => {
		const { request } = await run('company', 'getAll', {
			parameters: { returnAll: false, limit: 10, filters: {} },
			responses: { data: { companies: [], pagination: { total_pages: 1 } } },
		});

		expect(request.url).toBe(`${ACCOUNT_BASE}/companies`);
	});

	it('lets a provisioner name the account instead of using the key\'s own', async () => {
		// The contract: account_id "may be your own account or an account you
		// provisioned". Without this a gestoría could only ever reach itself.
		const managed = '99999999-8888-7777-6666-555555555555';
		const { request } = await run('company', 'getAll', {
			parameters: { activeAccount: managed, returnAll: false, limit: 10, filters: {} },
			responses: { data: { companies: [], pagination: { total_pages: 1 } } },
		});

		expect(request.url).toBe(`https://app.beel.es/api/v1/accounts/${managed}/companies`);
	});

	it('substitutes both axes on a path that carries the two', async () => {
		const { request } = await run('paymentEvent', 'getAll', {
			parameters: {
				activeCompany: COMPANY_ID,
				// The generator suffixes the name when two operations word it differently.
				provider_paymentEvent_getAll: 'stripe',
				returnAll: false,
				limit: 10,
				filters: {},
			},
			responses: { data: [], pagination: { total_pages: 1 } },
		});

		expect(request.url).toBe(`${COMPANY_BASE}/payment-connections/stripe/events`);
	});

	it('never leaves a placeholder in the URL it sends', async () => {
		const { request } = await run('customer', 'get', {
			parameters: { customerId: CUSTOMER_ID, activeCompany: COMPANY_ID },
		});

		expect(request.url).not.toMatch(/[{}]/);
	});

	it('no longer sends the retired active-company header', async () => {
		const { request } = await run('customer', 'get', {
			parameters: { customerId: CUSTOMER_ID, activeCompany: COMPANY_ID },
		});

		expect(request.headers).not.toHaveProperty('Beel-Active-Company');
	});
});

describe('headers', () => {
	it('adds an idempotency key to every POST', async () => {
		const { request } = await run('nif', 'validate', { parameters: { nif: 'B86561412' } });

		expect((request.headers as Record<string, string>)['Idempotency-Key']).toMatch(
			/^[0-9a-f-]{36}$/,
		);
	});

	/**
	 * The node adds this header itself — the contract does not declare it — so it
	 * is the one value the generated validation never sees. Without this, a key
	 * built from a timestamp reaches the API and comes back as a 400 with the
	 * invoice request already in flight.
	 */
	it('rejects an idempotency key the API would refuse, before sending', async () => {
		await expect(
			run('nif', 'validate', {
				parameters: { nif: 'B86561412', idempotencyKey: '2026-08-20T15:42:39.123Z-B86561412' },
			}),
		).rejects.toThrow(/idempotency key has characters BeeL will reject/);
	});

	it('accepts a UUID and plain alphanumeric text', async () => {
		for (const key of ['550e8400-e29b-41d4-a716-446655440000', 'ORD42', 'pedido2026']) {
			const { request } = await run('nif', 'validate', {
				parameters: { nif: 'B86561412', idempotencyKey: key },
			});
			expect((request.headers as Record<string, string>)['Idempotency-Key']).toBe(key);
		}
	});

	it('uses the idempotency key supplied by the workflow', async () => {
		const { request } = await run('nif', 'validate', {
			parameters: { nif: 'B86561412', idempotencyKey: 'order-42' },
		});

		expect((request.headers as Record<string, string>)['Idempotency-Key']).toBe('order-42');
	});

	it('does not add an idempotency key to a GET', async () => {
		const { request } = await run('invoice', 'get', { parameters: { invoiceId: INVOICE_ID } });

		expect(request.headers).not.toHaveProperty('Idempotency-Key');
	});
});
