/**
 * Generates `nodes/Beel/descriptions/generated/operations.generated.ts` from
 * `openapi/public-api.yaml`.
 *
 * Run `npm run generate` after updating the contract, and `npm run generate:check`
 * in CI — it fails when the committed artefact is stale or when the contract grew
 * an endpoint that is neither generated, hand-written nor explicitly excluded.
 *
 * Labels, descriptions, required fields, field constraints, pagination and list
 * keys all come from the contract; `config.ts` only holds what it cannot express.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { parse } from 'yaml';

import {
	DISPLAY_NAME_OVERRIDES,
	EXCLUDED_OPERATION_IDS,
	LOAD_OPTIONS_BY_FIELD,
	MANUAL_OPERATION_IDS,
	OPERATION_NAMES,
	REFERENCED_OPERATION_IDS,
	RESERVED_PARAMETER_NAMES,
	RESOURCES,
	TAX_PERCENTAGES,
} from './config';
import { assertEnglishUiText, FIELD_UI_OVERRIDES, OPTION_NAME_OVERRIDES } from './ui-text';
import type {
	GeneratedField,
	GeneratedOperation,
	GeneratedValidation,
} from '../nodes/Beel/descriptions/generated/types';
// The scoping rule is shared with the runtime on purpose — see nodes/Beel/scope.ts.
import { scopeAxesOf } from '../nodes/Beel/scope';

const ROOT = join(__dirname, '..');
const SPEC_PATH = join(ROOT, 'openapi', 'public-api.yaml');
const OUTPUT_PATH = join(ROOT, 'nodes', 'Beel', 'descriptions', 'generated', 'operations.generated.ts');

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

type Json = Record<string, any>;

const spec: Json = parse(readFileSync(SPEC_PATH, 'utf8'));

// ── Schema helpers ──────────────────────────────────────────────────────────

function deref(schema: Json | undefined): Json {
	if (!schema) return {};

	if (schema.$ref) {
		const path = (schema.$ref as string).replace(/^#\//, '').split('/');
		let node: Json = spec;
		for (const segment of path) node = node[segment];
		return { ...deref(node), ...(schema.description ? { description: schema.description } : {}) };
	}

	// `allOf` is used throughout the contract to attach a description to a $ref.
	if (Array.isArray(schema.allOf)) {
		return schema.allOf.reduce<Json>(
			(merged, part) => {
				const resolved = deref(part);
				return {
					...merged,
					...resolved,
					description: schema.description ?? resolved.description ?? merged.description,
					properties: { ...(merged.properties ?? {}), ...(resolved.properties ?? {}) },
					required: [...(merged.required ?? []), ...(resolved.required ?? [])],
				};
			},
			{ ...schema, allOf: undefined },
		);
	}

	return schema;
}

function titleCase(name: string): string {
	if (DISPLAY_NAME_OVERRIDES[name]) return DISPLAY_NAME_OVERRIDES[name];

	return name
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.split(/[_\-.\s]/)
		.filter(Boolean)
		.map((word) => DISPLAY_NAME_OVERRIDES[word.toLowerCase()] ?? word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
		// n8n's own convention: identifiers read "ID", not "Id".
		.replace(/\bIds?\b/g, (match) => (match === 'Ids' ? 'IDs' : 'ID'));
}

function firstSentence(text: string | undefined): string | undefined {
	if (!text) return undefined;
	const trimmed = text.replace(/\s+/g, ' ').trim();
	if (trimmed === '') return undefined;
	const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
	const sentence = (match ? match[0] : trimmed).trim().replace(/\.$/, '');
	return sentence.length > 300 ? `${sentence.slice(0, 297)}...` : sentence;
}

function camelCase(name: string): string {
	return name.replace(/[_-](\w)/g, (_, char: string) => char.toUpperCase());
}

function enumOptions(schema: Json): GeneratedField['options'] | undefined {
	if (!Array.isArray(schema.enum)) return undefined;

	// Enum semantics are documented as "- VALUE: meaning" bullet lists.
	const docs = new Map<string, string>();
	for (const line of String(schema.description ?? '').split('\n')) {
		const match = line.match(/^\s*[-*]\s*`?'?([A-Za-z0-9_.]+)'?`?\s*[:–-]\s*(.+)$/);
		if (match) docs.set(match[1], match[2].trim());
	}

	return (schema.enum as Array<string | number>).map((value) => ({
		// The label may need translating (the value never does — it is the API's).
		name: OPTION_NAME_OVERRIDES[String(value)] ?? titleCase(String(value)),
		value,
		...(docs.has(String(value)) ? { description: docs.get(String(value)) } : {}),
	}));
}

/** Copies the contract's constraints so they can be enforced before the request. */
function validationOf(schema: Json): GeneratedValidation | undefined {
	const validation: GeneratedValidation = {};

	if (typeof schema.pattern === 'string') validation.pattern = schema.pattern;
	if (typeof schema.minLength === 'number') validation.minLength = schema.minLength;
	if (typeof schema.maxLength === 'number') validation.maxLength = schema.maxLength;
	if (typeof schema.minimum === 'number') validation.minimum = schema.minimum;
	if (typeof schema.maximum === 'number') validation.maximum = schema.maximum;
	if (schema.exclusiveMinimum === true) validation.exclusiveMinimum = true;
	if (typeof schema.multipleOf === 'number') validation.multipleOf = schema.multipleOf;
	if (typeof schema.minItems === 'number') validation.minItems = schema.minItems;
	if (typeof schema.format === 'string') validation.format = schema.format;

	return Object.keys(validation).length > 0 ? validation : undefined;
}

/** Turns constraints into a human hint appended to the field description. */
function constraintHint(validation: GeneratedValidation | undefined, type: string): string | undefined {
	if (!validation) return undefined;
	const hints: string[] = [];

	if (validation.format === 'date') hints.push('YYYY-MM-DD');
	else if (validation.format === 'date-time') hints.push('ISO 8601 date-time');
	else if (validation.format === 'uuid') hints.push('UUID');
	else if (validation.format === 'email') hints.push('email address');
	else if (validation.format === 'uri') hints.push('URL');

	if (type === 'string') {
		if (validation.minLength !== undefined && validation.minLength === validation.maxLength) {
			hints.push(`exactly ${validation.minLength} characters`);
		} else {
			if (validation.minLength !== undefined && validation.minLength > 1) {
				hints.push(`min ${validation.minLength} characters`);
			}
			if (validation.maxLength !== undefined) hints.push(`max ${validation.maxLength} characters`);
		}
	}

	if (type === 'number') {
		if (validation.minimum !== undefined && validation.maximum !== undefined) {
			hints.push(`between ${validation.minimum}${validation.exclusiveMinimum ? ' (exclusive)' : ''} and ${validation.maximum}`);
		} else if (validation.minimum !== undefined) {
			hints.push(`${validation.exclusiveMinimum ? 'greater than' : 'min'} ${validation.minimum}`);
		} else if (validation.maximum !== undefined) {
			hints.push(`max ${validation.maximum}`);
		}
	}

	return hints.length > 0 ? hints.join(', ') : undefined;
}

/**
 * Replaces a tax percentage field with one variant per tax type, each offering
 * only the rates that type accepts. Returns the fields unchanged when the
 * collection is not a tax object.
 */
function applyTaxPercentageOptions(fields: GeneratedField[]): GeneratedField[] {
	const taxTypes = Object.keys(TAX_PERCENTAGES);

	const typeField = fields.find(
		(field) =>
			field.apiName.split('.').pop() === 'type' &&
			field.options !== undefined &&
			taxTypes.every((taxType) => field.options!.some((option) => option.value === taxType)),
	);
	const percentageField = fields.find((field) => field.apiName.split('.').pop() === 'percentage');

	if (!typeField || !percentageField) return fields;

	return fields.flatMap((field) => {
		if (field !== percentageField) return [field];

		return Object.entries(TAX_PERCENTAGES).map(([taxType, rates]) => {
			const showWhen = { field: typeField.name, values: [taxType] };

			// A type with no fixed list keeps the free number input.
			if (rates === null) return { ...field, name: `${field.name}_${taxType}`, showWhen };

			return {
				...field,
				name: `${field.name}_${taxType}`,
				type: 'options' as const,
				options: rates.map((rate) => ({ name: `${rate}%`, value: rate })),
				default: rates.includes(21) ? 21 : rates[0],
				description: `${field.description ?? 'Tax percentage'} — rates allowed for ${taxType}`,
				showWhen,
			};
		});
	});
}

function isScalarSchema(schema: Json): boolean {
	const type = schema.type;
	return type === 'string' || type === 'number' || type === 'integer' || type === 'boolean';
}

/**
 * Maps one OpenAPI property to one or more generated fields, or `null` when the
 * shape has no sensible form control.
 *
 * Objects become a `fixedCollection` at the top level; deeper down n8n cannot
 * nest collections, so their scalar children are flattened into `parent_child`
 * fields whose `apiName` keeps the dotted path (`parent.child`) for the executor
 * to rebuild. Arrays of objects (invoice lines) become a repeatable collection.
 */
function toFields(apiName: string, rawSchema: Json, required: boolean, depth = 0): GeneratedField[] | null {
	const field = toField(apiName, rawSchema, required, depth);
	if (field !== null) return [field];

	const schema = deref(rawSchema);
	if (schema.type !== 'object' || depth === 0) return null;

	const properties = (schema.properties ?? {}) as Json;
	const flattened: GeneratedField[] = [];

	for (const [childName, childSchema] of Object.entries(properties)) {
		const children = toFields(childName, childSchema as Json, false, depth + 1);
		if (!children) return null;

		for (const child of children) {
			const groupRequired = (schema.required ?? []).includes(child.apiName);

			flattened.push({
				// A field its own object requires is never "not set": once the object is
				// sent it must carry a real value, so restore the enum's own default.
				...(groupRequired ? withoutEmptyChoice(child) : child),
				name: `${apiName}_${child.name}`,
				apiName: `${apiName}.${child.apiName}`,
				displayName: `${titleCase(apiName)} ${child.displayName}`,
				required: required && groupRequired,
				// Required within its own object, even when the object itself is optional:
				// this is what tells the executor whether a half-filled group may be sent.
				...(groupRequired ? { groupRequired: true } : {}),
			});
		}
	}

	return flattened;
}

/** Undoes the optional-enum "not set" choice, for fields their own object requires. */
function withoutEmptyChoice(field: GeneratedField): GeneratedField {
	if (field.type !== 'options' || field.default !== '') return field;

	const options = (field.options ?? []).filter((option) => option.value !== '');
	if (options.length === (field.options ?? []).length) return field;

	return { ...field, options, default: options[0].value };
}

/** Maps one OpenAPI property to a single generated field, or `null` when unsupported. */
function toField(apiName: string, rawSchema: Json, required: boolean, depth = 0): GeneratedField | null {
	const schema = deref(rawSchema);
	const validation = validationOf(schema);

	// UI text the contract states in Spanish: n8n only allows English in the editor.
	const uiOverride = FIELD_UI_OVERRIDES[apiName] ?? {};

	const base = {
		name: apiName,
		apiName,
		displayName: titleCase(apiName),
		description: uiOverride.description ?? firstSentence(schema.description),
		...(required ? { required: true } : {}),
		...(validation ? { validation } : {}),
	};

	const withHint = (field: GeneratedField): GeneratedField => {
		const hint = constraintHint(field.validation, field.type);
		if (!hint) return field;
		return {
			...field,
			description: field.description ? `${field.description} (${hint})` : `Format: ${hint}`,
		};
	};

	const options = enumOptions(schema);
	if (options) {
		// A dropdown always holds some value, so an optional enum with no default in
		// the contract would silently send its first member — which is how an
		// untouched "Exemption Reason" ended up on every invoice line. Give those an
		// explicit empty choice; the executor leaves empty values out of the request.
		if (!required && schema.default === undefined) {
			return {
				...base,
				type: 'options',
				options: [{ name: '— Not set —', value: '' }, ...options],
				default: '',
			};
		}

		return { ...base, type: 'options', options, default: schema.default ?? options[0].value };
	}

	if (LOAD_OPTIONS_BY_FIELD[apiName] && schema.type === 'string') {
		return { ...base, type: 'options', loadOptionsMethod: LOAD_OPTIONS_BY_FIELD[apiName], default: '' };
	}

	switch (schema.type) {
		case 'string':
			return withHint({
				...base,
				type: 'string',
				default: uiOverride.default ?? schema.default ?? '',
				...(uiOverride.placeholder !== undefined
					? { placeholder: uiOverride.placeholder }
					: schema.example !== undefined
						? { placeholder: String(schema.example) }
						: {}),
			});

		case 'integer':
			return withHint({ ...base, type: 'number', default: schema.default ?? 0, numberPrecision: 0 });

		case 'number':
			return withHint({ ...base, type: 'number', default: schema.default ?? 0 });

		case 'boolean':
			return { ...base, type: 'boolean', default: schema.default ?? false };

		case 'array': {
			const items = deref(schema.items);

			// An array of objects (invoice lines) becomes a repeatable collection.
			if (items.type === 'object' || items.properties !== undefined) {
				if (depth > 0) return null;

				const itemRequired = (items.required ?? []) as string[];
				const nested: GeneratedField[] = [];

				for (const [childName, childSchema] of Object.entries((items.properties ?? {}) as Json)) {
					const children = toFields(
						childName,
						childSchema as Json,
						itemRequired.includes(childName),
						depth + 1,
					);
					if (!children) return null;
					nested.push(...children);
				}
				if (nested.length === 0) return null;

				return {
					...base,
					type: 'fixedCollection',
					fields: applyTaxPercentageOptions(nested),
					multipleValues: true,
					default: {},
				};
			}

			if (!isScalarSchema(items)) return null;
			const itemField = toField(apiName, items, false, depth + 1);
			if (!itemField) return null;
			return withHint({
				...base,
				type: itemField.type,
				...(itemField.options ? { options: itemField.options } : {}),
				...(itemField.validation ? { validation: { ...itemField.validation, ...validation } } : {}),
				multipleValues: true,
				default: [],
			});
		}

		case 'object':
		case undefined: {
			const properties = (schema.properties ?? {}) as Json;
			const names = Object.keys(properties);

			// Free-form maps (e.g. invoice metadata) are edited as JSON.
			if (names.length === 0) return { ...base, type: 'json', default: '{}' };

			if (depth > 0) return null; // handled by toFields, which flattens instead

			const nested: GeneratedField[] = [];
			for (const propertyName of names) {
				const children = toFields(
					propertyName,
					properties[propertyName],
					(schema.required ?? []).includes(propertyName),
					depth + 1,
				);
				if (!children) return { ...base, type: 'json', default: '{}' };
				nested.push(...children);
			}

			return { ...base, type: 'fixedCollection', fields: applyTaxPercentageOptions(nested), default: {} };
		}

		default:
			return { ...base, type: 'json', default: '{}' };
	}
}

// ── Operation extraction ────────────────────────────────────────────────────

interface SpecOperation {
	method: GeneratedOperation['method'];
	path: string;
	definition: Json;
	/** Parameters declared once for the whole path, shared by all its methods. */
	pathItemParameters: Json[];
}

const specOperations = new Map<string, SpecOperation>();

for (const [path, pathItem] of Object.entries(spec.paths as Json)) {
	for (const method of HTTP_METHODS) {
		const definition = (pathItem as Json)[method];
		if (!definition?.operationId) continue;
		specOperations.set(definition.operationId, {
			method: method.toUpperCase() as GeneratedOperation['method'],
			path,
			definition,
			pathItemParameters: ((pathItem as Json).parameters ?? []) as Json[],
		});
	}
}

const resourceByTag = new Map<string, (typeof RESOURCES)[number]>();
for (const resource of RESOURCES) {
	for (const tag of resource.tags) resourceByTag.set(tag, resource);
}

/**
 * Reads the success response to learn whether the endpoint returns a collection
 * and, if so, where the array lives: directly in `data`, or under `data.<key>`.
 */
function listShapeOf(definition: Json, paginated: boolean): { isList: boolean; listKey: string } {
	const success = definition.responses?.['200'] ?? definition.responses?.['201'];
	const schema = deref(success?.content?.['application/json']?.schema);
	const data = deref(schema.properties?.data);

	if (data.type === 'array') return { isList: true, listKey: '' };

	// A wrapper object pairs the array with `pagination`; without it, an array
	// property is just a field of a single resource (e.g. an invoice's lines).
	const hasPagination = data.properties?.pagination !== undefined || schema.properties?.pagination !== undefined;
	if (!paginated && !hasPagination) return { isList: false, listKey: '' };

	for (const [name, property] of Object.entries((data.properties ?? {}) as Json)) {
		if (deref(property as Json).type === 'array') return { isList: true, listKey: name };
	}

	return { isList: false, listKey: '' };
}

function optionalCollectionNameFor(method: string, operation: string): string {
	if (method === 'PUT' || method === 'PATCH') return 'updateFields';
	if (operation === 'create' || operation.startsWith('create')) return 'additionalFields';
	return 'options';
}

function buildOperation(operationId: string, operation: string): GeneratedOperation {
	const found = specOperations.get(operationId);
	if (!found) throw new Error(`operationId "${operationId}" is not in the contract`);

	const { method, path, definition, pathItemParameters } = found;

	const tag = (definition.tags ?? [])[0] as string | undefined;
	const resource = tag ? resourceByTag.get(tag) : undefined;
	if (!resource) {
		throw new Error(`"${operationId}" has tag "${tag}", which no resource in config.ts claims`);
	}

	// An operation's own parameters win over the path-level ones of the same name.
	const own = ((definition.parameters ?? []) as Json[]).map(deref);
	const ownKeys = new Set(own.map((parameter) => `${parameter.in}:${parameter.name}`));
	const parameters = [
		...pathItemParameters.map(deref).filter((parameter) => !ownKeys.has(`${parameter.in}:${parameter.name}`)),
		...own,
	];

	// `page` is what makes an endpoint paginated; only then does `limit` belong to
	// pagination rather than being a plain result cap (as in product search).
	const paginated = parameters.some((p) => p.in === 'query' && p.name === 'page');
	const scopes = new Set(scopeAxesOf(path).map((axis) => axis.parameter));

	const pathParams: GeneratedField[] = [];
	const filters: GeneratedField[] = [];
	const requiredFilters: GeneratedField[] = [];
	const queryParamNames: string[] = [];

	for (const parameter of parameters) {
		const apiName = parameter.name as string;

		if (paginated && parameter.in === 'query' && ['page', 'limit'].includes(apiName)) continue;
		if (parameter.in === 'path' && scopes.has(apiName)) continue;

		const parameterFields = toFields(apiName, parameter.schema ?? {}, parameter.required === true);
		if (!parameterFields || parameterFields.length !== 1) continue;

		const field = parameterFields[0];
		field.description = firstSentence(parameter.description) ?? field.description;

		if (parameter.in === 'path') {
			pathParams.push({ ...field, name: camelCase(apiName), required: true });
		} else if (parameter.in === 'query') {
			queryParamNames.push(apiName);
			if (parameter.required === true) requiredFilters.push({ ...field, required: true });
			else filters.push(field);
		}
	}

	const body = deref(definition.requestBody?.content?.['application/json']?.schema);
	const bodyRequired = new Set<string>((body.required ?? []) as string[]);
	const requiredFields: GeneratedField[] = [];
	const optionalFields: GeneratedField[] = [];

	for (const [apiName, propertySchema] of Object.entries((body.properties ?? {}) as Json)) {
		const fields = toFields(apiName, propertySchema as Json, bodyRequired.has(apiName));
		if (!fields) {
			throw new Error(
				`"${operationId}" has a field "${apiName}" the generator cannot map to a form control. ` +
					'Add the operation to MANUAL_OPERATION_IDS and hand-write it.',
			);
		}

		if (bodyRequired.has(apiName)) requiredFields.push(...fields);
		else optionalFields.push(...fields);
	}

	const placeholders = [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
	// Scope placeholders are covered by the request helper, not by a field.
	const covered = new Set([...pathParams.map((field) => field.apiName), ...scopes]);
	const uncovered = placeholders.filter((placeholder) => !covered.has(placeholder));

	if (uncovered.length > 0) {
		throw new Error(
			`"${operationId}" has path placeholders with no parameter: ${uncovered.join(', ')}. ` +
				'The request would be sent with the placeholder still in the URL.',
		);
	}

	return {
		resource: resource.resource,
		operation,
		displayName: operation === 'getAll' ? 'Get Many' : titleCase(operation),
		action: firstSentence(definition.summary) ?? titleCase(operation),
		description: firstSentence(definition.description) ?? firstSentence(definition.summary) ?? '',
		operationId,
		method,
		path,
		pathParams,
		requiredFields: [...requiredFields, ...requiredFilters],
		optionalFields,
		filters,
		optionalCollectionName: optionalCollectionNameFor(method, operation),
		queryParamNames: [...queryParamNames],
		paginated,
		...listShapeOf(definition, paginated),
	};
}

// Resource order in the dropdown follows RESOURCES; operations follow OPERATION_NAMES.
const operations: GeneratedOperation[] = Object.entries(OPERATION_NAMES)
	.map(([operationId, operation]) => buildOperation(operationId, operation))
	.sort((a, b) => {
		const order = RESOURCES.findIndex((r) => r.resource === a.resource) -
			RESOURCES.findIndex((r) => r.resource === b.resource);
		return order !== 0 ? order : 0;
	});

// ── Name disambiguation ─────────────────────────────────────────────────────
// n8n stores parameter values by name, so two operations may only share a name
// when the definitions are identical. Otherwise the later one gets a suffix.

const signatures = new Map<string, string>();

for (const operation of operations) {
	const suffix = `${operation.resource}_${operation.operation}`;

	for (const field of [...operation.pathParams, ...operation.requiredFields]) {
		// A generated field must never shadow a parameter the node defines itself,
		// or reading one would silently return the other's value.
		if (RESERVED_PARAMETER_NAMES.includes(field.name)) {
			field.name = `${field.name}_${suffix}`;
		}

		// Only behaviour has to match: two endpoints often word the same parameter
		// differently, and that is no reason to fragment it into two names.
		const { name, description, placeholder, displayName, ...rest } = field;
		const signature = JSON.stringify(rest);
		const existing = signatures.get(field.name);

		if (existing === undefined) {
			signatures.set(field.name, signature);
			continue;
		}
		if (existing === signature) continue;

		field.name = `${field.name}_${suffix}`;
		signatures.set(field.name, signature);
	}
}

// ── English-only check ──────────────────────────────────────────────────────
// Runs before anything is written, and again on every `--check` in CI: the
// contract is Spanish, the editor may not be, and this is the seam between them.

assertEnglishUiText(operations);

// ── Contract paths for the hand-written code ────────────────────────────────
// Anything a `.ts` file calls by hand gets its URL from here rather than typing
// it out, so the contract stays the only place a path is written down.

const referenced = [...MANUAL_OPERATION_IDS, ...REFERENCED_OPERATION_IDS];

const missingReferenced = referenced.filter((operationId) => !specOperations.has(operationId));
if (missingReferenced.length > 0) {
	throw new Error(
		`The contract no longer has ${missingReferenced.length} endpoint(s) the hand-written code ` +
			`calls:\n  ${missingReferenced.join('\n  ')}\n` +
			'Find what replaced them, update the caller, then update scripts/config.ts ' +
			'(MANUAL_OPERATION_IDS or REFERENCED_OPERATION_IDS).',
	);
}

const contractPaths = Object.fromEntries(
	referenced.sort().map((operationId) => [operationId, specOperations.get(operationId)!.path]),
);

// ── Coverage checks ─────────────────────────────────────────────────────────

// An endpoint can be both an operation and something a loader calls, so dedupe.
const exposed = [...new Set([...Object.keys(OPERATION_NAMES), ...referenced])];

const covered = new Set([...exposed, ...EXCLUDED_OPERATION_IDS]);

/**
 * Endpoints the contract has and the config says nothing about.
 *
 * Deprecated ones are not a gap: the contract marks them, and the node has
 * moved to whatever replaced them. Only a live endpoint is a decision waiting
 * to be made.
 */
const uncovered = [...specOperations.entries()]
	.filter(([operationId, found]) => !covered.has(operationId) && !found.definition.deprecated)
	.map(([operationId]) => operationId);

/**
 * Endpoints the node uses that the contract has since deprecated.
 *
 * This is the check that was missing. The API moved the multi-NIF scope from
 * the `Beel-Active-Company` header into the path and deprecated the entire flat
 * surface; the node kept calling it, and nothing said so until the requests
 * started resolving to the wrong company. A deprecation is the API telling us
 * where the work is — so it fails the build, with the endpoints to migrate.
 */
const deprecatedInUse = exposed.filter((operationId) => specOperations.get(operationId)?.definition.deprecated);

/** Exclusions the contract has since dropped, so the list does not rot. */
const staleExclusions = EXCLUDED_OPERATION_IDS.filter((operationId) => !specOperations.has(operationId));

// ── Emit ────────────────────────────────────────────────────────────────────

const output = `/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Produced by \`npm run generate\` from \`openapi/public-api.yaml\`
 * (BeeL Public API ${spec.info.version}).
 *
 * Hand-written operations live in \`../InvoiceDescription.ts\`.
 */

import type { GeneratedOperation, GeneratedResource } from './types';

/** Resource dropdown, in the order declared in scripts/config.ts. */
export const GENERATED_RESOURCES: GeneratedResource[] = ${JSON.stringify(
	RESOURCES.filter((resource) => operations.some((operation) => operation.resource === resource.resource)).map(
		({ resource, displayName }) => ({ resource, displayName }),
	),
	null,
	'\t',
)};

export const GENERATED_OPERATIONS: GeneratedOperation[] = ${JSON.stringify(operations, null, '\t')};

/**
 * Paths of the endpoints the hand-written code calls directly, straight from the
 * contract — the dropdown loaders, the identity lookup and the Trigger node's
 * subscription. Declared in \`REFERENCED_OPERATION_IDS\`; generation fails if the
 * contract drops one, so a retired route can never be left hardcoded in a caller.
 */
export const CONTRACT_PATHS: Record<string, string> = ${JSON.stringify(contractPaths, null, '\t')};
`;

/**
 * Problems that make the artefact wrong rather than merely incomplete, so they
 * fail `npm run generate` too — regenerating onto a deprecated route would just
 * commit the drift instead of surfacing it.
 */
const blocking: string[] = [];

if (deprecatedInUse.length > 0) {
	blocking.push(
		`The contract deprecated ${deprecatedInUse.length} endpoint(s) this node still calls:\n  ` +
			`${deprecatedInUse.join('\n  ')}\n` +
			'Each has a replacement in the contract — find it, map it in scripts/config.ts, and ' +
			'update any caller. Do not silence this by excluding them: EXCLUDED_OPERATION_IDS is ' +
			'for live endpoints deliberately not exposed.',
	);
}

if (staleExclusions.length > 0) {
	blocking.push(
		`EXCLUDED_OPERATION_IDS names ${staleExclusions.length} endpoint(s) the contract no longer ` +
			`has:\n  ${staleExclusions.join('\n  ')}\nDrop them from scripts/config.ts.`,
	);
}

if (process.argv.includes('--check')) {
	const problems = [...blocking];

	if (uncovered.length > 0) {
		problems.push(
			`The contract has ${uncovered.length} live endpoint(s) that are neither generated, ` +
				`hand-written nor excluded:\n  ${uncovered.join('\n  ')}\n` +
				'Add them to scripts/config.ts (OPERATION_NAMES, MANUAL_OPERATION_IDS or EXCLUDED_OPERATION_IDS).',
		);
	}

	if (readFileSync(OUTPUT_PATH, 'utf8') !== output) {
		problems.push('operations.generated.ts is stale — run `npm run generate` and commit the result.');
	}

	if (problems.length > 0) {
		console.error(`\n${problems.join('\n\n')}\n`);
		process.exit(1);
	}

	console.log(`OK — ${operations.length} generated operations, contract fully covered.`);
} else {
	if (blocking.length > 0) {
		console.error(`\n${blocking.join('\n\n')}\n`);
		process.exit(1);
	}

	writeFileSync(OUTPUT_PATH, output);
	console.log(`Wrote ${operations.length} operations to ${OUTPUT_PATH.replace(`${ROOT}/`, '')}`);
	if (uncovered.length > 0) {
		console.warn(`WARNING: ${uncovered.length} uncovered endpoint(s): ${uncovered.join(', ')}`);
	}
}
