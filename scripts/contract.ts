/**
 * Keeps `openapi/public-api.yaml` honest about where it came from.
 *
 * The contract is vendored: a copy of a file that lives in another repository.
 * Nothing was keeping the two in step, so the copy fell four endpoints, three
 * tags and one deprecation behind without a single test going red — including
 * the deprecation guard, which cannot warn about a `deprecated: true` it has
 * never seen. A guard that watches a frozen file is not a guard.
 *
 * Two commands, both offline-safe about what they claim:
 *
 *   npm run contract:sync    fetch the source and overwrite the local copy
 *   npm run contract:check   fail if the local copy has drifted from the source
 *
 * `check` compares OPERATIONS, not bytes: prose edits to a description are not
 * drift worth failing a build over, while an endpoint that appeared, moved,
 * changed tag or was deprecated is exactly what the generator needs to know.
 */

import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { parse } from 'yaml';

import { CONTRACT_SOURCE } from './config';

const ROOT = join(__dirname, '..');
const LOCAL_PATH = join(ROOT, 'openapi', 'public-api.yaml');

interface Operation {
	method: string;
	path: string;
	tags: string;
	deprecated: boolean;
}

/** Every operation the contract serves, keyed by `operationId`. */
export function operationsOf(spec: unknown): Map<string, Operation> {
	const operations = new Map<string, Operation>();
	const paths = (spec as { paths?: Record<string, Record<string, unknown>> })?.paths ?? {};

	for (const [path, item] of Object.entries(paths)) {
		for (const [method, definition] of Object.entries(item)) {
			const operation = definition as {
				operationId?: string;
				tags?: string[];
				deprecated?: boolean;
			};
			if (!operation?.operationId) continue;

			operations.set(operation.operationId, {
				method: method.toUpperCase(),
				path,
				tags: (operation.tags ?? []).join(','),
				deprecated: operation.deprecated === true,
			});
		}
	}

	return operations;
}

export interface Drift {
	added: string[];
	removed: string[];
	moved: string[];
	retagged: string[];
	deprecated: string[];
}

/** What changed between the source contract and the local copy. */
export function driftBetween(source: unknown, local: unknown): Drift {
	const from = operationsOf(source);
	const to = operationsOf(local);

	const describe = (id: string, field: (operation: Operation) => string) =>
		`${id}: local=${field(to.get(id)!)} source=${field(from.get(id)!)}`;

	const shared = [...from.keys()].filter((id) => to.has(id));

	return {
		added: [...from.keys()].filter((id) => !to.has(id)),
		removed: [...to.keys()].filter((id) => !from.has(id)),
		moved: shared
			.filter((id) => from.get(id)!.path !== to.get(id)!.path || from.get(id)!.method !== to.get(id)!.method)
			.map((id) => describe(id, (operation) => `${operation.method} ${operation.path}`)),
		retagged: shared
			.filter((id) => from.get(id)!.tags !== to.get(id)!.tags)
			.map((id) => describe(id, (operation) => operation.tags)),
		deprecated: shared
			.filter((id) => from.get(id)!.deprecated !== to.get(id)!.deprecated)
			.map((id) => describe(id, (operation) => String(operation.deprecated))),
	};
}

export function hasDrifted(drift: Drift): boolean {
	return Object.values(drift).some((entries) => entries.length > 0);
}

/**
 * The source contract, read through `gh` so it works with whatever credentials
 * the caller already has — a developer's login locally, a token in CI — without
 * this repository holding any of its own.
 */
function fetchSource(): string {
	const { repo, ref, path } = CONTRACT_SOURCE;
	try {
		return execFileSync(
			'gh',
			['api', `repos/${repo}/contents/${path}?ref=${ref}`, '--header', 'Accept: application/vnd.github.raw'],
			{ encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
		);
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new Error(
			`Could not read ${repo}@${ref}:${path}.\n` +
				'`gh` must be installed and authenticated against a token that reaches that repository.\n' +
				reason,
		);
	}
}

function report(drift: Drift): void {
	const sections: Array<[string, string[]]> = [
		['in the source but not here', drift.added],
		['here but gone from the source', drift.removed],
		['moved to another path or method', drift.moved],
		['now carries a different tag', drift.retagged],
		['deprecation flag changed', drift.deprecated],
	];

	for (const [title, entries] of sections) {
		if (entries.length === 0) continue;
		console.error(`\n${entries.length} operation(s) ${title}:`);
		for (const entry of entries) console.error(`  ${entry}`);
	}
}

function main(): void {
	const check = process.argv.includes('--check');
	const { repo, ref } = CONTRACT_SOURCE;

	const source = fetchSource();
	const local = readFileSync(LOCAL_PATH, 'utf8');

	if (!check) {
		writeFileSync(LOCAL_PATH, source);
		const drift = driftBetween(parse(source), parse(local));
		console.log(`Synced openapi/public-api.yaml from ${repo}@${ref}.`);
		if (hasDrifted(drift)) {
			report(drift);
			console.log('\nRun `npm run generate` and re-run the tests: the node is built from this file.');
		} else {
			console.log('No operation changed — descriptions only.');
		}
		return;
	}

	const drift = driftBetween(parse(source), parse(local));

	if (!hasDrifted(drift)) {
		console.log(`openapi/public-api.yaml matches ${repo}@${ref}.`);
		return;
	}

	console.error(`openapi/public-api.yaml has drifted from ${repo}@${ref}.`);
	report(drift);
	console.error('\nRun `npm run contract:sync`, then `npm run generate`, and commit both.');
	process.exit(1);
}

if (require.main === module) {
	main();
}
