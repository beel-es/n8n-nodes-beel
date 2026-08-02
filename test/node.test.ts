import type { INodeProperties } from 'n8n-workflow';
import { describe, expect, it } from 'vitest';

import { Beel } from '../nodes/Beel/Beel.node';
import { BeelTrigger } from '../nodes/BeelTrigger/BeelTrigger.node';
import { BeelApi } from '../credentials/BeelApi.credentials';
import { GENERATED_OPERATIONS } from '../nodes/Beel/descriptions/generated/operations.generated';
import { MANUAL_OPERATIONS } from '../nodes/Beel/manualOperations';
import { makeContext } from './helpers';

/**
 * Most properties are generated, so the failure mode is not a typo but a clash.
 * n8n stores parameter values by name: the same name twice with different types,
 * or a generated field landing on one the node defines itself, silently corrupts
 * an operation without anything in TypeScript noticing.
 */

const node = new Beel();
const properties = node.description.properties;
const ALL_OPERATIONS = [...GENERATED_OPERATIONS, ...MANUAL_OPERATIONS];

function walk(list: INodeProperties[], visit: (property: INodeProperties) => void): void {
	for (const property of list) {
		visit(property);
		for (const option of property.options ?? []) {
			if ('values' in option) walk(option.values as INodeProperties[], visit);
		}
	}
}

describe('the node description', () => {
	it('declares each parameter name with a single type', () => {
		const types = new Map<string, string>();

		for (const property of properties) {
			const seen = types.get(property.name);
			if (seen === undefined) types.set(property.name, property.type);
			else expect(`${property.name}:${property.type}`).toBe(`${property.name}:${seen}`);
		}
	});

	it('only shows properties for resources and operations that exist', () => {
		const resources = new Set(
			(properties.find((property) => property.name === 'resource')?.options ?? []).map(
				(option) => (option as { value: string }).value,
			),
		);
		const operations = new Set(ALL_OPERATIONS.map((operation) => operation.operation));

		for (const property of properties) {
			const show = property.displayOptions?.show as Record<string, unknown[]> | undefined;
			for (const resource of (show?.resource ?? []) as string[]) {
				expect(resources).toContain(resource);
			}
			for (const operation of (show?.operation ?? []) as string[]) {
				expect(operations).toContain(operation);
			}
		}
	});

	it('backs every dropdown by a loadOptions method that exists', () => {
		const available = new Set(Object.keys(node.methods.loadOptions));

		walk(properties, (property) => {
			const method = property.typeOptions?.loadOptionsMethod;
			if (typeof method === 'string') expect(available).toContain(method);
		});
	});

	it('gives every path placeholder a parameter the node actually renders', () => {
		const names = new Set(properties.map((property) => property.name));

		for (const operation of ALL_OPERATIONS) {
			const placeholders = [...operation.path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
			const covered = new Set(operation.pathParams.map((field) => field.apiName));

			for (const placeholder of placeholders) {
				expect(
					covered.has(placeholder),
					`${operation.resource}.${operation.operation} has no parameter for {${placeholder}}`,
				).toBe(true);
			}

			for (const field of operation.pathParams) {
				expect(names, `${operation.resource}.${operation.operation}`).toContain(field.name);
			}
		}
	});

	it('offers every operation in its resource dropdown', () => {
		for (const operation of ALL_OPERATIONS) {
			const selector = properties.find(
				(property) =>
					property.name === 'operation' &&
					(property.displayOptions?.show?.resource as string[])?.includes(operation.resource),
			);

			expect(selector, `no operation dropdown for ${operation.resource}`).toBeDefined();
			expect(
				(selector!.options ?? []).map((option) => (option as { value: string }).value),
			).toContain(operation.operation);
		}
	});
});

describe('the trigger description', () => {
	it('reads the raw body, without which no signature can be verified', () => {
		const webhook = new BeelTrigger().description.webhooks?.[0];

		expect(webhook?.rawBody).toBe(true);
		expect(webhook?.httpMethod).toBe('POST');
	});
});

describe('the credential', () => {
	it('sends the API key as a bearer token', () => {
		const credential = new BeelApi();

		expect(credential.authenticate.properties.headers?.Authorization).toBe(
			'=Bearer {{$credentials.apiKey}}',
		);
	});

	it('tests itself against a read-only endpoint', () => {
		expect(new BeelApi().test.request.url).toBe('/v1/configuration/series');
	});
});

describe('executing the node', () => {
	it('pairs each output item with the input that produced it', async () => {
		const stub = makeContext({
			inputItems: 2,
			parameters: { resource: 'nif', operation: 'validate', nif: 'B86561412' },
			responses: { data: { valid: true } },
		});

		const [items] = await node.execute.call(stub.context);

		expect(items).toHaveLength(2);
		expect(items[0].pairedItem).toEqual({ item: 0 });
		expect(items[1].pairedItem).toEqual({ item: 1 });
	});

	it('collects the error as an item when Continue On Fail is set', async () => {
		const stub = makeContext({
			continueOnFail: true,
			parameters: { resource: 'nif', operation: 'validate', nif: 'B123' },
		});

		const [items] = await node.execute.call(stub.context);

		expect(items).toHaveLength(1);
		expect(items[0].json.error).toMatch(/exactly 9 characters/);
	});

	it('refuses an operation the resource does not have', async () => {
		const stub = makeContext({ parameters: { resource: 'nif', operation: 'delete' } });

		await expect(node.execute.call(stub.context)).rejects.toThrow(/not supported/);
	});
});
