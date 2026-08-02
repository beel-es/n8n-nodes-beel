import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { beelApiRequest, beelApiRequestAllItems, resolveCompanyId, unwrap } from './GenericFunctions';
import type { GeneratedField, GeneratedOperation } from './descriptions/generated/types';
import { validateField } from './validation';

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
				const nested: IDataObject = {};
				for (const child of field.fields ?? []) {
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
