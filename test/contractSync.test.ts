import { describe, expect, it } from 'vitest';

import { driftBetween, hasDrifted, operationsOf } from '../scripts/contract';

/**
 * These pin the comparison, not the fetch: the network is not a test dependency.
 *
 * Each case is one of the four ways the contract actually moved under the node
 * this release — an endpoint appeared, three changed tag, one was deprecated —
 * plus the case that must NOT fail a build, which is a description someone
 * reworded. Getting that last one wrong would make the guard cry wolf until
 * somebody turned it off.
 */

const operation = (
	operationId: string,
	extra: Record<string, unknown> = {},
) => ({ operationId, tags: ['Invoices'], ...extra });

const spec = (paths: Record<string, Record<string, unknown>>) => ({ paths });

const BASE = spec({
	'/v1/companies/{company_id}/invoices': { get: operation('listCompanyInvoices') },
	'/v1/configuration/series/{series_id}': { put: operation('updateSeries', { tags: ['Series'] }) },
});

describe('drift between the source contract and the vendored copy', () => {
	it('says nothing when the two agree', () => {
		const drift = driftBetween(BASE, BASE);
		expect(hasDrifted(drift)).toBe(false);
	});

	it('ignores a reworded description', () => {
		const reworded = spec({
			'/v1/companies/{company_id}/invoices': {
				get: operation('listCompanyInvoices', { description: 'Now explained at length.' }),
			},
			'/v1/configuration/series/{series_id}': { put: operation('updateSeries', { tags: ['Series'] }) },
		});

		expect(hasDrifted(driftBetween(reworded, BASE))).toBe(false);
	});

	it('reports an endpoint the source has and the copy does not', () => {
		const withPreview = spec({
			...BASE.paths,
			'/v1/companies/{company_id}/invoices/{invoice_id}/preview': {
				get: operation('getCompanyInvoicePreview'),
			},
		});

		expect(driftBetween(withPreview, BASE).added).toEqual(['getCompanyInvoicePreview']);
	});

	it('reports an endpoint the source dropped', () => {
		expect(driftBetween(BASE, spec({ ...BASE.paths, '/v1/gone': { get: operation('goneOperation') } })).removed)
			.toEqual(['goneOperation']);
	});

	/** The change that broke generation: the tag is the generator's join key. */
	it('reports a tag change, which is what binds an operation to a resource', () => {
		const retagged = spec({
			'/v1/companies/{company_id}/invoices': {
				get: operation('listCompanyInvoices', { tags: ['CompanyInvoices'] }),
			},
			'/v1/configuration/series/{series_id}': { put: operation('updateSeries', { tags: ['Series'] }) },
		});

		expect(driftBetween(retagged, BASE).retagged).toEqual([
			'listCompanyInvoices: local=Invoices source=CompanyInvoices',
		]);
	});

	/** The change no test could have caught while the copy stayed frozen. */
	it('reports a deprecation the copy has not heard about', () => {
		const deprecated = spec({
			'/v1/companies/{company_id}/invoices': { get: operation('listCompanyInvoices') },
			'/v1/configuration/series/{series_id}': {
				put: operation('updateSeries', { tags: ['Series'], deprecated: true }),
			},
		});

		expect(driftBetween(deprecated, BASE).deprecated).toEqual([
			'updateSeries: local=false source=true',
		]);
	});

	it('reports an operation that moved to another path', () => {
		const moved = spec({
			'/v1/accounts/{account_id}/invoices': { get: operation('listCompanyInvoices') },
			'/v1/configuration/series/{series_id}': { put: operation('updateSeries', { tags: ['Series'] }) },
		});

		expect(driftBetween(moved, BASE).moved).toEqual([
			'listCompanyInvoices: local=GET /v1/companies/{company_id}/invoices ' +
				'source=GET /v1/accounts/{account_id}/invoices',
		]);
	});

	it('skips path entries that carry no operationId', () => {
		const withParameters = spec({
			'/v1/companies/{company_id}/invoices': {
				get: operation('listCompanyInvoices'),
				parameters: [{ name: 'company_id', in: 'path' }] as unknown as Record<string, unknown>,
			},
			'/v1/configuration/series/{series_id}': { put: operation('updateSeries', { tags: ['Series'] }) },
		});

		expect([...operationsOf(withParameters).keys()]).toEqual(['listCompanyInvoices', 'updateSeries']);
	});
});
