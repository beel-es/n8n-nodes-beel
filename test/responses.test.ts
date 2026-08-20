import { describe, expect, it } from 'vitest';

import { beelApiRequest, unwrap } from '../nodes/Beel/GenericFunctions';
import { executeGeneratedOperation } from '../nodes/Beel/genericExecutor';
import { INVOICE_ID, makeContext, operationFor } from './helpers';

/**
 * The API wraps payloads in `{ data, meta }`, and puts a list either directly in
 * `data` or under a named key next to `pagination`. The metadata records which
 * shape each endpoint uses; these check the executor reads it correctly.
 */

function page(invoices: unknown[], currentPage: number, totalPages: number) {
	return { data: { invoices, pagination: { page: currentPage, total_pages: totalPages } } };
}

describe('reading a response', () => {
	it('unwraps the envelope', () => {
		expect(unwrap({ data: { id: 'x' }, meta: {} })).toEqual({ id: 'x' });
	});

	it('returns the payload as-is when there is no envelope', () => {
		expect(unwrap({ id: 'x' } as never)).toEqual({ id: 'x' });
	});

	it('turns each element of a list into its own item', async () => {
		const stub = makeContext({
			parameters: { returnAll: true },
			responses: page([{ id: 'a' }, { id: 'b' }], 1, 1),
		});

		const result = await executeGeneratedOperation.call(
			stub.context,
			operationFor('invoice', 'getAll'),
			0,
		);

		expect(result).toEqual([{ id: 'a' }, { id: 'b' }]);
	});

	it('reads a list that sits directly in data', async () => {
		const stub = makeContext({ responses: { data: [{ id: 'a' }, { id: 'b' }] } });

		const result = await executeGeneratedOperation.call(
			stub.context,
			operationFor('company', 'getAll'),
			0,
		);

		expect(result).toEqual([{ id: 'a' }, { id: 'b' }]);
	});

	it('reports success on a 204 with no content', async () => {
		const stub = makeContext({ parameters: { invoiceId: INVOICE_ID }, responses: undefined });

		const result = await executeGeneratedOperation.call(
			stub.context,
			operationFor('invoice', 'delete'),
			0,
		);

		expect(result).toEqual([{ success: true }]);
	});
});

describe('pagination', () => {
	it('walks every page when Return All is on', async () => {
		const stub = makeContext({
			parameters: { returnAll: true },
			responses: [page([{ id: 'a' }], 1, 3), page([{ id: 'b' }], 2, 3), page([{ id: 'c' }], 3, 3)],
		});

		const result = await executeGeneratedOperation.call(
			stub.context,
			operationFor('invoice', 'getAll'),
			0,
		);

		expect(result).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
		expect(stub.requests).toHaveLength(3);
		expect(stub.requests.map((request) => (request.qs as { page: number }).page)).toEqual([1, 2, 3]);
	});

	it('stops at the limit without asking for more pages', async () => {
		const stub = makeContext({
			parameters: { returnAll: false, limit: 2 },
			responses: page([{ id: 'a' }, { id: 'b' }], 1, 5),
		});

		const result = await executeGeneratedOperation.call(
			stub.context,
			operationFor('invoice', 'getAll'),
			0,
		);

		expect(result).toHaveLength(2);
		expect(stub.requests).toHaveLength(1);
		expect((stub.requests[0].qs as { limit: number }).limit).toBe(2);
	});

	it('stops on an empty page rather than looping', async () => {
		const stub = makeContext({
			parameters: { returnAll: true },
			responses: [page([{ id: 'a' }], 1, 99), page([], 2, 99)],
		});

		const result = await executeGeneratedOperation.call(
			stub.context,
			operationFor('invoice', 'getAll'),
			0,
		);

		expect(result).toEqual([{ id: 'a' }]);
		expect(stub.requests).toHaveLength(2);
	});

	it('carries the filters into every page', async () => {
		const stub = makeContext({
			parameters: { returnAll: true, filters: { status: 'ISSUED' } },
			responses: [page([{ id: 'a' }], 1, 2), page([{ id: 'b' }], 2, 2)],
		});

		await executeGeneratedOperation.call(stub.context, operationFor('invoice', 'getAll'), 0);

		for (const request of stub.requests) {
			expect((request.qs as { status: string }).status).toBe('ISSUED');
		}
	});
});

/**
 * El contrato puede equivocarse sobre la forma de la respuesta, y cuando lo hace
 * el nodo no falla: lista cero elementos con un 200 y nadie se entera.
 *
 * Pasó de verdad. `GET /v1/accounts/{account_id}/companies` declara `data` como
 * array y la API devuelve `data.companies[]`, así que "Company → Get Many"
 * respondía CERO NIFs contra la API real. Ningún test lo veía porque todos
 * responden lo que dice el contrato, no lo que devuelve el servidor.
 */
describe('when the contract gets the response shape wrong', () => {
	it('finds the list anyway instead of silently returning none', async () => {
		const stub = makeContext({
			parameters: { returnAll: false, limit: 10, filters: {} },
			// El contrato dice que `data` es el array; la API manda un sobre.
			responses: {
				data: {
					companies: [{ id: 'a', legal_name: 'Uno' }, { id: 'b', legal_name: 'Dos' }],
					pagination: { total_pages: 1 },
				},
			},
		});

		const items = await executeGeneratedOperation.call(
			stub.context,
			operationFor('company', 'getAll'),
			0,
		);

		expect(items).toHaveLength(2);
	});

	it('still prefers the key the contract declares when it is there', async () => {
		const stub = makeContext({
			parameters: { returnAll: false, limit: 10, filters: {} },
			responses: {
				data: {
					customers: [{ id: 'right' }],
					// Un array vecino que no debe ganarle al declarado.
					deleted: [{ id: 'wrong' }, { id: 'wrong' }],
					pagination: { total_pages: 1 },
				},
			},
		});

		const items = await executeGeneratedOperation.call(
			stub.context,
			operationFor('customer', 'getAll'),
			0,
		);

		expect(items).toEqual([{ id: 'right' }]);
	});
});

describe('errors', () => {
	it('surfaces the message the API sent', async () => {
		const stub = makeContext({
			error: {
				statusCode: 422,
				error: {
					error: { code: 'VALIDATION_ERROR', message: "The field 'recipient' cannot be empty" },
				},
			},
		});

		await expect(
			beelApiRequest.call(stub.context, 'GET', '/v1/invoices'),
		).rejects.toThrow(/recipient/);
	});

	it('still fails cleanly when the body carries no message', async () => {
		const stub = makeContext({ error: { statusCode: 500 } });

		await expect(beelApiRequest.call(stub.context, 'GET', '/v1/invoices')).rejects.toBeDefined();
	});
});
