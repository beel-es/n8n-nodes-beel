/**
 * End-to-end checks over the generic executor, against a stubbed n8n context.
 *
 * The executor turns UI values into an HTTP request entirely from generated
 * metadata, so these assert the two things that metadata is responsible for:
 * the request that comes out, and the constraints that stop a bad one.
 */

import { GENERATED_OPERATIONS } from '../nodes/Beel/descriptions/generated/operations.generated';
import { executeGeneratedOperation } from '../nodes/Beel/genericExecutor';

const failures: string[] = [];
let requested: any;

/** Key-order-independent comparison, since both sides are built by different code. */
function stable(value: unknown): string {
	return JSON.stringify(value, (_key, inner) => {
		if (inner === null || typeof inner !== 'object' || Array.isArray(inner)) return inner;
		return Object.fromEntries(Object.entries(inner as object).sort(([a], [b]) => a.localeCompare(b)));
	});
}

function context(parameters: Record<string, unknown>) {
	return {
		getNode: () => ({ name: 'BeeL', type: 'beel', typeVersion: 1, position: [0, 0], parameters: {} }),
		getNodeParameter: (name: string, _itemIndex: number, fallback?: unknown) =>
			name in parameters ? parameters[name] : fallback,
		getCredentials: async () => ({ apiKey: 'beel_sk_test_x', baseUrl: 'https://app.beel.es/api' }),
		helpers: {
			httpRequestWithAuthentication: async (_credential: string, options: unknown) => {
				requested = options;
				return { data: { id: 'inv-1' } };
			},
		},
	} as any;
}

function specFor(resource: string, operation: string) {
	const spec = GENERATED_OPERATIONS.find(
		(candidate) => candidate.resource === resource && candidate.operation === operation,
	);
	if (!spec) throw new Error(`No generated operation ${resource}.${operation}`);
	return spec;
}

/** Runs an operation and asserts the request that would have been sent. */
async function expectRequest(
	label: string,
	resource: string,
	operation: string,
	parameters: Record<string, unknown>,
	expected: { method: string; url: string; body?: unknown; companyId?: string },
): Promise<void> {
	requested = undefined;
	try {
		await executeGeneratedOperation.call(context(parameters), specFor(resource, operation), 0);
	} catch (error) {
		failures.push(`${label}: unexpected error — ${(error as Error).message}`);
		return;
	}

	const actual = {
		method: requested.method,
		url: requested.url,
		...(expected.body !== undefined ? { body: requested.body } : {}),
		...(expected.companyId !== undefined
			? { companyId: requested.headers['Beel-Active-Company'] }
			: {}),
	};

	if (stable(actual) !== stable(expected)) {
		failures.push(
			`${label}:\n  expected ${JSON.stringify(expected, null, 2)}\n  actual   ${JSON.stringify(actual, null, 2)}`,
		);
		return;
	}

	if (expected.method === 'POST' && !requested.headers['Idempotency-Key']) {
		failures.push(`${label}: POST went out without an Idempotency-Key`);
	}

	console.log(`ok  ${label}`);
}

/** Asserts an invalid value is rejected before any request is made. */
async function expectRejection(
	label: string,
	resource: string,
	operation: string,
	parameters: Record<string, unknown>,
	expectedMessage: RegExp,
): Promise<void> {
	requested = undefined;
	try {
		await executeGeneratedOperation.call(context(parameters), specFor(resource, operation), 0);
		failures.push(`${label}: expected a validation error, none was raised`);
	} catch (error) {
		const message = (error as Error).message;
		if (!expectedMessage.test(message)) {
			failures.push(`${label}: message "${message}" does not match ${expectedMessage}`);
			return;
		}
		if (requested !== undefined) {
			failures.push(`${label}: a request was sent despite the invalid value`);
			return;
		}
		console.log(`ok  ${label} — ${message}`);
	}
}

const INVOICE_ID = '550e8400-e29b-41d4-a716-446655440000';
const CUSTOMER_ID = '4f244735-980b-8d9c-80e8-6331fa0b1958';
const SERIES_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const COMPANY_ID = '660e8400-e29b-41d4-a716-446655440001';

(async () => {
	// Nested objects (`main_tax`) are flattened in the UI and rebuilt here; JSON
	// fields are parsed; the company override reaches the header.
	await expectRequest(
		'invoice.create builds the full payload',
		'invoice',
		'create',
		{
			companyId: COMPANY_ID,
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
			additionalFields: {
				series_id: SERIES_ID,
				metadata: '{"order_id":"ORD-42"}',
				options: { value: { issue_directly: true, wait_for_pdf: true } },
			},
		},
		{
			method: 'POST',
			url: 'https://app.beel.es/api/v1/invoices',
			companyId: COMPANY_ID,
			body: {
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
				options: { issue_directly: true, wait_for_pdf: true },
			},
		},
	);

	// Regression: n8n fills every field of a collection with its contract default
	// as soon as the collection exists, so picking a customer used to ship a
	// half-built `address` (country "España") and `alternative_id` (type "02"),
	// and the API rejected the invoice for the fields it was never given.
	await expectRequest(
		'a customer recipient does not carry empty address or alternative ID objects',
		'invoice',
		'create',
		{
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
			lines: { value: [{ description: 'Sprint 1', quantity: 1, unit_price: 100 }] },
			additionalFields: {},
		},
		{
			method: 'POST',
			url: 'https://app.beel.es/api/v1/invoices',
			body: {
				type: 'STANDARD',
				recipient: { customer_id: CUSTOMER_ID },
				lines: [{ description: 'Sprint 1', quantity: 1, unit_price: 100 }],
			},
		},
	);

	// A genuinely inline recipient still sends the whole address.
	await expectRequest(
		'an inline recipient sends its full address',
		'invoice',
		'create',
		{
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
					alternative_id_type: '02',
					alternative_id_number: '',
				},
			},
			lines: { value: [{ description: 'Sprint 1', quantity: 1, unit_price: 100 }] },
			additionalFields: {},
		},
		{
			method: 'POST',
			url: 'https://app.beel.es/api/v1/invoices',
			body: {
				type: 'STANDARD',
				recipient: {
					legal_name: 'Acme SL',
					nif: 'B86561412',
					address: {
						street: 'Calle Mayor',
						number: '1',
						postal_code: '28001',
						city: 'Madrid',
						province: 'Madrid',
						country: 'España',
						country_code: 'ES',
					},
				},
				lines: [{ description: 'Sprint 1', quantity: 1, unit_price: 100 }],
			},
		},
	);

	// Only the rates the chosen tax type allows are offered, and the hidden
	// variants must not leak into the request.
	await expectRequest(
		'the tax percentage follows the chosen tax type',
		'invoice',
		'create',
		{
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
		{
			method: 'POST',
			url: 'https://app.beel.es/api/v1/invoices',
			body: {
				type: 'STANDARD',
				recipient: { customer_id: CUSTOMER_ID },
				lines: [
					{
						description: 'Canarias',
						quantity: 1,
						unit_price: 100,
						main_tax: { type: 'IGIC', percentage: 7 },
					},
				],
			},
		},
	);

	await expectRejection(
		'a half-filled address says which fields are missing',
		'invoice',
		'create',
		{
			type: 'STANDARD',
			recipient: {
				value: { legal_name: 'Acme SL', nif: 'B86561412', address_street: 'Calle Mayor' },
			},
			lines: { value: [{ description: 'Sprint 1', quantity: 1, unit_price: 100 }] },
			additionalFields: {},
		},
		/missing required address fields/,
	);

	await expectRequest(
		'invoice.void substitutes the path parameter',
		'invoice',
		'void',
		{ invoiceId: INVOICE_ID, reason_invoice_void: 'Duplicada por error de integración' },
		{
			method: 'POST',
			url: `https://app.beel.es/api/v1/invoices/${INVOICE_ID}/void`,
			body: { reason: 'Duplicada por error de integración' },
		},
	);

	await expectRejection(
		'a short NIF is caught before the call',
		'nif',
		'validate',
		{ nif: 'B123' },
		/exactly 9 characters/,
	);

	await expectRejection(
		'a non-ISO date is caught before the call',
		'invoice',
		'schedule',
		{ invoiceId: INVOICE_ID, scheduled_for: '15/04/2026' },
		/YYYY-MM-DD/,
	);

	await expectRejection(
		'a void reason below the minimum is caught before the call',
		'invoice',
		'void',
		{ invoiceId: INVOICE_ID, reason_invoice_void: 'corto' },
		/at least 10 characters/,
	);

	await expectRejection(
		'a required address field is caught before the call',
		'customer',
		'create',
		{ legal_name: 'Acme SL', address: { value: { street: 'Calle Mayor' } }, additionalFields: {} },
		/is required/,
	);

	if (failures.length > 0) {
		console.error(`\n${failures.join('\n\n')}\n`);
		process.exit(1);
	}

	console.log('OK — executor produces the expected requests.');
})();
