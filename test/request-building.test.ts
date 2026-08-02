import { describe, expect, it } from 'vitest';

import { executeGeneratedOperation } from '../nodes/Beel/genericExecutor';
import { COMPANY_ID, CUSTOMER_ID, INVOICE_ID, SERIES_ID, makeContext, operationFor } from './helpers';

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
		expect(request.url).toBe('https://app.beel.es/api/v1/invoices');
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
			parameters: { invoiceId: INVOICE_ID, reason_invoice_void: 'Duplicada por error' },
		});

		expect(request.url).toBe(`https://app.beel.es/api/v1/invoices/${INVOICE_ID}/void`);
		expect(request.body).toEqual({ reason: 'Duplicada por error' });
	});

	it('substitutes a path parameter declared once for the whole path item', async () => {
		// Regression: these endpoints declare company_id at path-item level rather
		// than per operation, and the URL used to go out with "{company_id}" in it.
		const { request } = await run('company', 'getRepresentationStatus', {
			parameters: { companyId: COMPANY_ID },
		});

		expect(request.url).toBe(
			`https://app.beel.es/api/v1/companies/${COMPANY_ID}/representation/status`,
		);
	});

	it('separates query parameters from the body', async () => {
		const { request } = await run('product', 'search', {
			parameters: { filters: { q: 'consult', limit: 5 } },
		});

		expect(request.method).toBe('GET');
		expect(request.qs).toEqual({ q: 'consult', limit: 5 });
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
		// (country "España") and alternative_id (type "02"), and the API rejected the
		// invoice for the fields it was never given.
		const { request } = await run('invoice', 'create', {
			parameters: {
				type: 'STANDARD',
				recipient: {
					value: {
						customer_id: CUSTOMER_ID,
						address_country: 'España',
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

describe('headers', () => {
	it('sends the active company chosen on the node', async () => {
		const { request } = await run('nif', 'validate', {
			parameters: { nif: 'B86561412', activeCompany: COMPANY_ID },
		});

		expect((request.headers as Record<string, string>)['Beel-Active-Company']).toBe(COMPANY_ID);
	});

	it('falls back to the company set on the credential', async () => {
		const { request } = await run('nif', 'validate', {
			parameters: { nif: 'B86561412' },
			credentials: { apiKey: 'beel_sk_test_x', companyId: COMPANY_ID },
		});

		expect((request.headers as Record<string, string>)['Beel-Active-Company']).toBe(COMPANY_ID);
	});

	it('omits the company header when none is configured', async () => {
		const { request } = await run('nif', 'validate', { parameters: { nif: 'B86561412' } });

		expect(request.headers).not.toHaveProperty('Beel-Active-Company');
	});

	it('adds an idempotency key to every POST', async () => {
		const { request } = await run('nif', 'validate', { parameters: { nif: 'B86561412' } });

		expect((request.headers as Record<string, string>)['Idempotency-Key']).toMatch(
			/^[0-9a-f-]{36}$/,
		);
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
