import { execFileSync } from 'child_process';
import { join } from 'path';

import { describe, expect, it } from 'vitest';

import { GENERATED_OPERATIONS } from '../nodes/Beel/descriptions/generated/operations.generated';

/**
 * The node is generated from `openapi/public-api.yaml`, so the contract is the
 * thing that can silently go out of step. These guard that seam.
 */

describe('the generated operations match the contract', () => {
	it('is not stale, and covers every endpoint', () => {
		// `--check` regenerates in memory and fails on a difference, or on an
		// endpoint that is neither generated, hand-written nor explicitly excluded.
		expect(() =>
			execFileSync('npx', ['tsx', join(__dirname, '..', 'scripts', 'generate.ts'), '--check'], {
				cwd: join(__dirname, '..'),
				stdio: 'pipe',
			}),
		).not.toThrow();
	}, 60_000);

	it('carries the constraints the contract declares', () => {
		const nif = GENERATED_OPERATIONS.find(
			(operation) => operation.resource === 'nif' && operation.operation === 'validate',
		)!.requiredFields.find((field) => field.apiName === 'nif')!;

		expect(nif.validation).toMatchObject({ minLength: 9, maxLength: 9 });
		expect(nif.validation?.pattern).toBeDefined();
	});

	it('offers only the tax rates each tax type accepts', () => {
		const line = GENERATED_OPERATIONS.find(
			(operation) => operation.resource === 'invoice' && operation.operation === 'create',
		)!.requiredFields.find((field) => field.apiName === 'lines')!;

		const rates = (taxType: string) =>
			line.fields
				?.find((field) => field.name === `main_tax_percentage_${taxType}`)
				?.options?.map((option) => option.value);

		expect(rates('IVA')).toEqual([0, 4, 10, 21]);
		expect(rates('IGIC')).toEqual([0, 3, 5, 7, 9.5, 15, 20]);
		expect(rates('IPSI')).toEqual([0.5, 1, 2, 4, 8, 10]);
		// OTHER accepts any percentage, so it stays a free number.
		expect(rates('OTHER')).toBeUndefined();
	});

	it('marks an optional enum as "not set" rather than picking its first member', () => {
		const line = GENERATED_OPERATIONS.find(
			(operation) => operation.resource === 'invoice' && operation.operation === 'create',
		)!.requiredFields.find((field) => field.apiName === 'lines')!;

		const exemption = line.fields?.find((field) => field.apiName === 'exemption_reason');
		expect(exemption?.default).toBe('');
		expect(exemption?.options?.[0].value).toBe('');
	});

	it('knows which endpoints are paginated and where their list lives', () => {
		const invoices = GENERATED_OPERATIONS.find(
			(operation) => operation.resource === 'invoice' && operation.operation === 'getAll',
		)!;
		const companies = GENERATED_OPERATIONS.find(
			(operation) => operation.resource === 'company' && operation.operation === 'getAll',
		)!;
		const single = GENERATED_OPERATIONS.find(
			(operation) => operation.resource === 'invoice' && operation.operation === 'get',
		)!;

		expect(invoices).toMatchObject({ paginated: true, isList: true, listKey: 'invoices' });
		expect(companies).toMatchObject({ isList: true, listKey: '' });
		// A single invoice has a `lines` array, which is a field, not a collection.
		expect(single.isList).toBe(false);
	});
});
