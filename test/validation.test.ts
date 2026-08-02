import { describe, expect, it } from 'vitest';

import { executeGeneratedOperation } from '../nodes/Beel/genericExecutor';
import { isVisible, validateField } from '../nodes/Beel/validation';
import type { GeneratedField } from '../nodes/Beel/descriptions/generated/types';
import { CUSTOMER_ID, INVOICE_ID, makeContext, operationFor } from './helpers';

/**
 * The constraints come from the contract, and are enforced before the request
 * leaves n8n: the point is that the workflow author sees which field is wrong
 * instead of a 422 that already spent an API call.
 */

const node = { name: 'BeeL', type: 'beel', typeVersion: 1, position: [0, 0], parameters: {} } as never;

function field(overrides: Partial<GeneratedField>): GeneratedField {
	return {
		name: 'x',
		apiName: 'x',
		displayName: 'X',
		type: 'string',
		default: '',
		...overrides,
	} as GeneratedField;
}

describe('field constraints', () => {
	it('rejects a value shorter than the minimum', () => {
		const nif = field({ displayName: 'NIF', validation: { minLength: 9, maxLength: 9 } });
		expect(() => validateField(node, nif, 'B123', 0)).toThrow(/exactly 9 characters/);
	});

	it('rejects a value longer than the maximum', () => {
		const name = field({ validation: { maxLength: 3 } });
		expect(() => validateField(node, name, 'abcd', 0)).toThrow(/at most 3 characters/);
	});

	it('rejects a date that is not ISO', () => {
		const date = field({ validation: { format: 'date' } });
		expect(() => validateField(node, date, '15/04/2026', 0)).toThrow(/YYYY-MM-DD/);
		expect(() => validateField(node, date, '2026-04-15', 0)).not.toThrow();
	});

	it('rejects a value that does not match the contract pattern', () => {
		const nif = field({ validation: { pattern: '^[A-Z]\\d{7}[A-Z0-9]$' } });
		expect(() => validateField(node, nif, 'lowercase', 0)).toThrow(/does not match the format/);
	});

	it('enforces exclusive minimums, which n8n cannot express', () => {
		const price = field({
			type: 'number',
			default: 0,
			validation: { minimum: 0, exclusiveMinimum: true },
		});
		expect(() => validateField(node, price, 0, 0)).toThrow(/greater than 0/);
		expect(() => validateField(node, price, 0.01, 0)).not.toThrow();
	});

	it('enforces maximums', () => {
		const discount = field({ type: 'number', default: 0, validation: { maximum: 100 } });
		expect(() => validateField(node, discount, 120, 0)).toThrow(/100 or less/);
	});

	it('reads multipleOf as a decimal limit', () => {
		const price = field({ type: 'number', default: 0, validation: { multipleOf: 0.0001 } });
		expect(() => validateField(node, price, 0.00001, 0)).toThrow(/at most 4 decimal places/);
		expect(() => validateField(node, price, 0.0897, 0)).not.toThrow();
	});

	it('rejects an invalid email and URL', () => {
		expect(() => validateField(node, field({ validation: { format: 'email' } }), 'nope', 0)).toThrow(
			/valid email/,
		);
		expect(() => validateField(node, field({ validation: { format: 'uri' } }), 'ftp://x', 0)).toThrow(
			/http\(s\) URL/,
		);
	});

	it('reports a missing required field', () => {
		expect(() => validateField(node, field({ required: true }), '', 0)).toThrow(/is required/);
	});

	it('accepts an empty optional field', () => {
		expect(() => validateField(node, field({ validation: { minLength: 5 } }), '', 0)).not.toThrow();
	});

	it('validates every entry of a repeatable collection', () => {
		const lines = field({
			type: 'fixedCollection',
			multipleValues: true,
			default: {},
			fields: [field({ name: 'description', apiName: 'description', validation: { maxLength: 5 } })],
		});

		expect(() =>
			validateField(node, lines, { value: [{ description: 'ok' }, { description: 'far too long' }] }, 0),
		).toThrow(/at most 5 characters/);
	});
});

describe('conditional fields', () => {
	it('applies only when its sibling holds one of the listed values', () => {
		const rate = field({ showWhen: { field: 'main_tax_type', values: ['IGIC'] } });

		expect(isVisible(rate, { main_tax_type: 'IGIC' })).toBe(true);
		expect(isVisible(rate, { main_tax_type: 'IVA' })).toBe(false);
		expect(isVisible(field({}), {})).toBe(true);
	});
});

describe('validation runs before the request', () => {
	it('does not call the API when a value is invalid', async () => {
		const stub = makeContext({ parameters: { nif: 'B123' } });

		await expect(
			executeGeneratedOperation.call(stub.context, operationFor('nif', 'validate'), 0),
		).rejects.toThrow(/exactly 9 characters/);

		expect(stub.requests).toHaveLength(0);
	});

	it('rejects malformed JSON in a free-form field', async () => {
		const stub = makeContext({
			parameters: {
				type: 'STANDARD',
				recipient: { value: { customer_id: CUSTOMER_ID } },
				lines: { value: [{ description: 'x', quantity: 1, unit_price: 10 }] },
				additionalFields: { metadata: '{not json' },
			},
		});

		await expect(
			executeGeneratedOperation.call(stub.context, operationFor('invoice', 'create'), 0),
		).rejects.toThrow(/not valid JSON/);
		expect(stub.requests).toHaveLength(0);
	});

	it('validates a path parameter too', async () => {
		const stub = makeContext({ parameters: { invoiceId: 'not-a-uuid' } });

		await expect(
			executeGeneratedOperation.call(stub.context, operationFor('invoice', 'get'), 0),
		).rejects.toThrow(/UUID/);
		expect(stub.requests).toHaveLength(0);
	});

	it('accepts a well-formed invoice ID', async () => {
		const stub = makeContext({ parameters: { invoiceId: INVOICE_ID } });

		await expect(
			executeGeneratedOperation.call(stub.context, operationFor('invoice', 'get'), 0),
		).resolves.toBeDefined();
	});
});
