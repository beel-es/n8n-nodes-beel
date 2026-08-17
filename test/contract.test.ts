import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import {
	CONTRACT_PATHS,
	GENERATED_OPERATIONS,
} from '../nodes/Beel/descriptions/generated/operations.generated';
import { MANUAL_OPERATIONS } from '../nodes/Beel/manualOperations';
import { scopeAxesOf } from '../nodes/Beel/scope';

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

	/**
	 * The node spent a release calling the flat `/v1/invoices` surface after the
	 * API deprecated all of it, and nothing failed — the requests just resolved
	 * to whatever company the key defaulted to. `--check` now fails on that, so
	 * this pins the guard rather than the symptom.
	 */
	it('calls nothing the contract has deprecated', () => {
		const spec = parse(readFileSync(join(__dirname, '..', 'openapi', 'public-api.yaml'), 'utf8'));

		const deprecated = new Set<string>();
		for (const pathItem of Object.values(spec.paths as Record<string, Record<string, any>>)) {
			for (const definition of Object.values(pathItem)) {
				if (definition?.operationId && definition.deprecated) deprecated.add(definition.operationId);
			}
		}

		const used = [
			...GENERATED_OPERATIONS.map((operation) => operation.operationId),
			...MANUAL_OPERATIONS.map((operation) => operation.operationId),
			...Object.keys(CONTRACT_PATHS),
		];

		expect(used.filter((operationId) => deprecated.has(operationId))).toEqual([]);
	});

	/**
	 * Every path the hand-written code calls comes from the contract, so a route
	 * the API retires breaks generation instead of 404ing at runtime.
	 */
	it('resolves every hand-written path from the contract', () => {
		const spec = parse(readFileSync(join(__dirname, '..', 'openapi', 'public-api.yaml'), 'utf8'));
		const paths = new Set(Object.keys(spec.paths as Record<string, unknown>));

		for (const [operationId, path] of Object.entries(CONTRACT_PATHS)) {
			expect(paths.has(path), `${operationId} → ${path} is not in the contract`).toBe(true);
		}
	});

	/** Scope placeholders are the request helper's job; nothing else may keep one. */
	it('leaves no unresolvable placeholder in an operation path', () => {
		for (const operation of [...GENERATED_OPERATIONS, ...MANUAL_OPERATIONS]) {
			const scopes = new Set(scopeAxesOf(operation.path).map((axis) => axis.parameter));
			const fields = new Set(operation.pathParams.map((field) => field.apiName));

			for (const [, placeholder] of operation.path.matchAll(/\{([^}]+)\}/g)) {
				expect(
					scopes.has(placeholder) || fields.has(placeholder),
					`${operation.resource}.${operation.operation}: {${placeholder}} is neither a scope nor a field`,
				).toBe(true);
			}
		}
	});

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
