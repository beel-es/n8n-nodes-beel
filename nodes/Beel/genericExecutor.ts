import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { beelApiRequest, beelApiRequestAllItems, resolveCompanyId, unwrap } from './GenericFunctions';
import type { GeneratedField, GeneratedOperation } from './descriptions/generated/types';
import { isVisible, validateField } from './validation';

/**
 * Executes any operation described by the generated metadata.
 *
 * Because the metadata carries the method, path, which parameters are query vs
 * body and how the response is shaped, a single function covers every generated
 * operation — new endpoints in the contract need no code here.
 */

/** Assigns `value` at a dotted path, creating intermediate objects. */
function setPath(target: IDataObject, path: string, value: unknown): void {
	const segments = path.split('.');
	let cursor = target;

	for (const segment of segments.slice(0, -1)) {
		if (typeof cursor[segment] !== 'object' || cursor[segment] === null) cursor[segment] = {};
		cursor = cursor[segment] as IDataObject;
	}

	cursor[segments[segments.length - 1]] = value as IDataObject[string];
}

/** The nested object a flattened field belongs to, or `''` when it is top level. */
function groupOf(field: GeneratedField): string {
	const separator = field.apiName.lastIndexOf('.');
	return separator === -1 ? '' : field.apiName.slice(0, separator);
}

/**
 * Decides which optional nested objects to leave out of the request.
 *
 * n8n materialises every field of a collection with its default as soon as the
 * collection exists, so an untouched `recipient.address` still arrives carrying
 * the contract's defaults (`country_code: ES`). Sending that half-built object
 * makes the API reject the whole invoice for a street it was never given.
 *
 * A group is only sent when every field it requires has a value. Since n8n
 * cannot tell a default apart from something the user typed, "the user meant
 * this" is read from the required fields that have no default at all: if one of
 * those was filled the group was clearly intended, so we say what is missing
 * rather than silently discarding the input.
 */
function groupsToDrop(
	context: IExecuteFunctions,
	field: GeneratedField,
	entry: IDataObject,
	itemIndex: number,
): Set<string> {
	const drop = new Set<string>();
	const groups = new Map<string, GeneratedField[]>();

	for (const child of field.fields ?? []) {
		const group = groupOf(child);
		if (group === '' || child.groupRequired !== true) continue;
		if (!isVisible(child, entry)) continue;
		groups.set(group, [...(groups.get(group) ?? []), child]);
	}

	const isEmpty = (child: GeneratedField): boolean => {
		const value = entry[child.name];
		return value === undefined || value === null || value === '';
	};

	for (const [group, required] of groups) {
		const missing = required.filter(isEmpty);
		if (missing.length === 0) continue;

		const deliberate = required.some(
			(child) => (child.default === '' || child.default === undefined) && !isEmpty(child),
		);

		if (!deliberate) {
			drop.add(group);
			continue;
		}

		throw new NodeOperationError(
			context.getNode(),
			`"${field.displayName}" is missing required ${group} fields: ${missing
				.map((child) => child.displayName)
				.join(', ')}`,
			{
				itemIndex,
				description: `Fill them in, or clear the whole ${group} group to leave it out.`,
			},
		);
	}

	return drop;
}

/** Reads a field from the UI and normalises it into the value the API expects. */
function readValue(
	context: IExecuteFunctions,
	field: GeneratedField,
	raw: unknown,
	itemIndex: number,
): unknown {
	if (raw === undefined || raw === null || raw === '') return undefined;

	if (field.type === 'fixedCollection') {
		// A fixedCollection arrives as { value: {...} }, or { value: [{...}, ...] }
		// when it is repeatable (invoice lines).
		const inner = (raw as IDataObject).value;
		const entries = (Array.isArray(inner) ? inner : [inner ?? {}]) as IDataObject[];

		const built = entries
			.map((entry) => {
				const skip = groupsToDrop(context, field, entry, itemIndex);
				const nested: IDataObject = {};

				for (const child of field.fields ?? []) {
					// Hidden variants can keep a stale value from a previous choice.
					if (!isVisible(child, entry)) continue;
					if (skip.has(groupOf(child))) continue;

					const childValue = readValue(context, child, entry[child.name], itemIndex);
					// `apiName` may be a dotted path (`main_tax.percentage`) because n8n
					// cannot nest collections; rebuild the object the API expects.
					if (childValue !== undefined) setPath(nested, child.apiName, childValue);
				}
				return nested;
			})
			.filter((entry) => Object.keys(entry).length > 0);

		if (field.multipleValues === true) return built.length > 0 ? built : undefined;
		return built[0];
	}

	if (field.type === 'json') {
		if (typeof raw !== 'string') return raw;
		try {
			return JSON.parse(raw);
		} catch {
			throw new NodeOperationError(
				context.getNode(),
				`"${field.displayName}" is not valid JSON`,
				{ itemIndex },
			);
		}
	}

	if (Array.isArray(raw) && raw.length === 0) return undefined;

	return raw;
}

interface CollectedFields {
	query: IDataObject;
	body: IDataObject;
}

function collect(
	context: IExecuteFunctions,
	operation: GeneratedOperation,
	fields: GeneratedField[],
	values: IDataObject,
	itemIndex: number,
	target: CollectedFields,
): void {
	const queryNames = new Set(operation.queryParamNames);

	for (const field of fields) {
		const raw = values[field.name];
		validateField(context.getNode(), field, raw, itemIndex);

		const value = readValue(context, field, raw, itemIndex);
		if (value === undefined) continue;

		if (queryNames.has(field.apiName)) target.query[field.apiName] = value as IDataObject[string];
		else target.body[field.apiName] = value as IDataObject[string];
	}
}

export async function executeGeneratedOperation(
	this: IExecuteFunctions,
	operation: GeneratedOperation,
	itemIndex: number,
): Promise<IDataObject[]> {
	const collected: CollectedFields = { query: {}, body: {} };

	// Path parameters.
	let path = operation.path;
	for (const field of operation.pathParams) {
		const value = this.getNodeParameter(field.name, itemIndex) as string;
		validateField(this.getNode(), field, value, itemIndex);
		path = path.replace(`{${field.apiName}}`, encodeURIComponent(value.trim()));
	}

	// Required fields are top-level properties.
	const requiredValues: IDataObject = {};
	for (const field of operation.requiredFields) {
		requiredValues[field.name] = this.getNodeParameter(field.name, itemIndex) as IDataObject[string];
	}
	collect(this, operation, operation.requiredFields, requiredValues, itemIndex, collected);

	// Optional fields and filters live in collections.
	if (operation.optionalFields.length > 0) {
		const values = this.getNodeParameter(
			operation.optionalCollectionName,
			itemIndex,
			{},
		) as IDataObject;
		collect(this, operation, operation.optionalFields, values, itemIndex, collected);
	}

	if (operation.filters.length > 0) {
		const values = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		collect(this, operation, operation.filters, values, itemIndex, collected);
	}

	const companyId = resolveCompanyId(this, itemIndex);

	if (operation.paginated) {
		const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = returnAll ? 0 : (this.getNodeParameter('limit', itemIndex, 50) as number);

		return await beelApiRequestAllItems.call(
			this,
			operation.listKey,
			path,
			collected.query,
			limit,
			companyId,
		);
	}

	const response = await beelApiRequest.call(
		this,
		operation.method,
		path,
		['GET', 'DELETE'].includes(operation.method) ? undefined : collected.body,
		collected.query,
		companyId,
		{},
		this.getNodeParameter('idempotencyKey', itemIndex, '') as string,
	);

	// 204 No Content — report the outcome rather than an empty item.
	if (response === undefined || response === null || response === '') {
		return [{ success: true }];
	}

	const data = unwrap(response);

	if (operation.isList) {
		const list = (
			operation.listKey === '' ? data : ((data as IDataObject)[operation.listKey] ?? [])
		) as IDataObject[];
		return Array.isArray(list) ? list : [list];
	}

	return [data];
}
