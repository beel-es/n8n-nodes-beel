/**
 * Structural checks over the node descriptions.
 *
 * Most properties are generated, so the failure mode is not a typo but a clash:
 * n8n stores parameter values by name, so the same name appearing twice with
 * different types silently corrupts one of the two operations. Nothing in the
 * TypeScript types catches that, hence this check.
 */

import type { INodeProperties } from 'n8n-workflow';

import { Beel } from '../nodes/Beel/Beel.node';
import { BeelTrigger } from '../nodes/BeelTrigger/BeelTrigger.node';

const problems: string[] = [];

function check(condition: boolean, message: string): void {
	if (!condition) problems.push(message);
}

for (const NodeType of [Beel, BeelTrigger]) {
	const node = new NodeType();
	const { name, properties } = node.description;

	check(properties.length > 0, `${name}: has no properties`);

	// 1. A parameter name must always mean the same kind of control.
	const types = new Map<string, string>();
	for (const property of properties) {
		const existing = types.get(property.name);
		if (existing === undefined) types.set(property.name, property.type);
		else {
			check(
				existing === property.type,
				`${name}: parameter "${property.name}" is declared as both "${existing}" and "${property.type}"`,
			);
		}
	}

	// 2. Every property must be reachable: either always shown, or shown for a
	//    resource/operation pair the node actually implements.
	const resources = new Set(
		(properties.find((property) => property.name === 'resource')?.options ?? []).map(
			(option) => (option as { value: string }).value,
		),
	);
	const operations = new Set<string>();
	for (const property of properties.filter((candidate) => candidate.name === 'operation')) {
		for (const option of property.options ?? []) {
			operations.add((option as { value: string }).value);
		}
	}

	for (const property of properties) {
		const show = property.displayOptions?.show as Record<string, unknown[]> | undefined;
		if (!show) continue;

		for (const resource of (show.resource ?? []) as string[]) {
			check(resources.has(resource), `${name}: "${property.name}" is shown for unknown resource "${resource}"`);
		}
		for (const operation of (show.operation ?? []) as string[]) {
			check(
				operations.has(operation),
				`${name}: "${property.name}" is shown for unknown operation "${operation}"`,
			);
		}
	}

	// 3. Dropdowns backed by a loadOptionsMethod need that method to exist.
	const loadOptions = new Set(Object.keys((node as { methods?: { loadOptions?: object } }).methods?.loadOptions ?? {}));

	const walk = (list: INodeProperties[]): void => {
		for (const property of list) {
			const method = property.typeOptions?.loadOptionsMethod;
			if (typeof method === 'string') {
				check(loadOptions.has(method), `${name}: "${property.name}" uses missing loadOptions method "${method}"`);
			}
			for (const option of property.options ?? []) {
				if ('values' in option) walk(option.values as INodeProperties[]);
			}
		}
	};
	walk(properties);

	console.log(`${name}: ${properties.length} properties, ${operations.size} operations`);
}

if (problems.length > 0) {
	console.error(`\n${problems.join('\n')}\n`);
	process.exit(1);
}

console.log('OK — node descriptions are consistent.');
