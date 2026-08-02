import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

import type { GeneratedField, GeneratedOperation } from './generated/types';

/**
 * Turns the metadata generated from the OpenAPI contract into n8n properties.
 *
 * Nothing here is BeeL-specific: it is the single place that decides how an API
 * field becomes a form control, so a change in that mapping applies to every
 * generated operation at once.
 */

type DisplayOptions = INodeProperties['displayOptions'];

/** "Lines" → "Line", for placeholders such as "Add Line". */
function singular(displayName: string): string {
	return displayName.replace(/ies$/, 'y').replace(/s$/, '');
}

function showFor(operation: GeneratedOperation): DisplayOptions {
	return {
		show: {
			resource: [operation.resource],
			operation: [operation.operation],
		},
	};
}

/** Maps a generated field to an n8n property (without display conditions). */
export function toNodeProperty(field: GeneratedField): INodeProperties {
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing -- default comes from the contract
	const property: INodeProperties = {
		displayName: field.displayName,
		name: field.name,
		type: 'string',
		default: field.default as string,
		...(field.description ? { description: field.description } : {}),
		...(field.placeholder ? { placeholder: field.placeholder } : {}),
		...(field.required ? { required: true } : {}),
		// Inside a collection, displayOptions resolve against sibling fields.
		...(field.showWhen
			? { displayOptions: { show: { [field.showWhen.field]: field.showWhen.values } } }
			: {}),
	};

	switch (field.type) {
		case 'options':
			property.type = 'options';
			if (field.loadOptionsMethod) {
				property.typeOptions = { loadOptionsMethod: field.loadOptionsMethod };
				property.options = [];
			} else {
				property.options = (field.options ?? []) as INodePropertyOptions[];
			}
			if (field.multipleValues) {
				property.type = 'multiOptions';
				property.default = [];
			}
			break;

		case 'number': {
			property.type = 'number';
			const typeOptions: Record<string, number> = {};
			const validation = field.validation ?? {};

			if (validation.minimum !== undefined) {
				// An exclusive minimum has no n8n equivalent; the runtime check covers it.
				typeOptions.minValue = validation.minimum;
			}
			if (validation.maximum !== undefined) typeOptions.maxValue = validation.maximum;
			if (field.numberPrecision !== undefined) typeOptions.numberPrecision = field.numberPrecision;

			if (Object.keys(typeOptions).length > 0) property.typeOptions = typeOptions;
			break;
		}

		case 'boolean':
			property.type = 'boolean';
			break;

		case 'json':
			property.type = 'json';
			property.typeOptions = { rows: 3 };
			break;

		case 'fixedCollection': {
			const repeatable = field.multipleValues === true;
			property.type = 'fixedCollection';
			property.typeOptions = { multipleValues: repeatable, ...(repeatable ? { sortable: true } : {}) };
			property.default = {};
			property.placeholder = repeatable ? `Add ${singular(field.displayName)}` : undefined;
			property.options = [
				{
					name: 'value',
					displayName: field.displayName,
					values: (field.fields ?? []).map(toNodeProperty),
				},
			];
			break;
		}

		case 'string':
		default:
			property.type = 'string';
			if (field.multipleValues) {
				property.typeOptions = { multipleValues: true };
				property.default = [];
			}
			break;
	}

	return property;
}

function collection(
	name: string,
	displayName: string,
	fields: GeneratedField[],
	operation: GeneratedOperation,
	placeholder: string,
): INodeProperties {
	return {
		displayName,
		name,
		type: 'collection',
		placeholder,
		default: {},
		displayOptions: showFor(operation),
		options: fields.map(toNodeProperty).sort((a, b) => a.displayName.localeCompare(b.displayName)),
	};
}

/** Builds every property for one generated operation. */
export function buildOperationProperties(operation: GeneratedOperation): INodeProperties[] {
	const properties: INodeProperties[] = [];
	const displayOptions = showFor(operation);

	for (const field of [...operation.pathParams, ...operation.requiredFields]) {
		properties.push({ ...toNodeProperty(field), required: true, displayOptions });
	}

	if (operation.paginated) {
		properties.push({
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			displayOptions,
		});
		properties.push({
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 50,
			typeOptions: { minValue: 1 },
			description: 'Max number of results to return',
			displayOptions: {
				show: { ...displayOptions!.show, returnAll: [false] },
			},
		});
	}

	if (operation.filters.length > 0) {
		properties.push(
			collection('filters', 'Filters', operation.filters, operation, 'Add filter'),
		);
	}

	if (operation.optionalFields.length > 0) {
		const displayNames: Record<string, string> = {
			updateFields: 'Update Fields',
			additionalFields: 'Additional Fields',
			options: 'Options',
		};
		properties.push(
			collection(
				operation.optionalCollectionName,
				displayNames[operation.optionalCollectionName] ?? 'Options',
				operation.optionalFields,
				operation,
				'Add field',
			),
		);
	}

	return properties;
}

/**
 * Collapses properties that are identical apart from the operation they are shown
 * for, so `Invoice ID` is one property listing every operation instead of fifteen
 * copies. Fewer properties keep the node description small and remove any doubt
 * about which copy n8n reads a value from.
 */
export function mergeProperties(properties: INodeProperties[]): INodeProperties[] {
	const merged: INodeProperties[] = [];
	const bySignature = new Map<string, INodeProperties>();

	for (const property of properties) {
		const show = property.displayOptions?.show as Record<string, string[]> | undefined;
		const operations = show?.operation;

		// Only mergeable when the sole varying condition is the operation.
		if (!show || !operations || Object.keys(show).some((key) => !['resource', 'operation'].includes(key))) {
			merged.push(property);
			continue;
		}

		const signature = JSON.stringify({ ...property, displayOptions: { show: { resource: show.resource } } });
		const existing = bySignature.get(signature);

		if (!existing) {
			bySignature.set(signature, property);
			merged.push(property);
			continue;
		}

		const target = (existing.displayOptions!.show as Record<string, string[]>).operation!;
		for (const operation of operations) {
			if (!target.includes(operation)) target.push(operation);
		}
	}

	return merged;
}

/** Builds the Operation dropdown for one resource. */
export function buildOperationSelector(
	resource: string,
	operations: GeneratedOperation[],
): INodeProperties {
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing -- default is the first generated operation
	return {
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		default: operations[0].operation,
		options: operations.map((operation) => ({
			name: operation.displayName,
			value: operation.operation,
			action: operation.action,
			description: operation.description,
		})),
	};
}
