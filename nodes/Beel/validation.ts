import type { IDataObject, INode } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { GeneratedField } from './descriptions/generated/types';

/**
 * Enforces the constraints declared in the OpenAPI contract before the request
 * leaves n8n.
 *
 * The API validates everything again — this exists so the workflow author sees
 * "NIF must be 9 characters" pointing at the offending field, instead of a 422
 * that also burned an API call and, for POSTs, an idempotency key.
 */

const FORMAT_CHECKS: Record<string, { test: RegExp; expected: string }> = {
	date: { test: /^\d{4}-\d{2}-\d{2}$/, expected: 'a date in YYYY-MM-DD format' },
	'date-time': { test: /^\d{4}-\d{2}-\d{2}[T ].+/, expected: 'an ISO 8601 date-time' },
	uuid: {
		test: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
		expected: 'a UUID',
	},
	email: { test: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, expected: 'a valid email address' },
	uri: { test: /^https?:\/\/.+/, expected: 'an http(s) URL' },
};

/** Whether a conditional field applies, given the values of its siblings. */
export function isVisible(field: GeneratedField, siblings: IDataObject): boolean {
	if (!field.showWhen) return true;
	return field.showWhen.values.includes(siblings[field.showWhen.field] as string | number);
}

function fail(node: INode, field: GeneratedField, problem: string, itemIndex: number): never {
	throw new NodeOperationError(node, `"${field.displayName}" ${problem}`, {
		itemIndex,
		description: field.description,
	});
}

function validateScalar(
	node: INode,
	field: GeneratedField,
	value: unknown,
	itemIndex: number,
): void {
	const rules = field.validation;
	if (!rules) return;

	if (typeof value === 'string') {
		if (rules.minLength !== undefined && value.length < rules.minLength) {
			fail(
				node,
				field,
				rules.minLength === rules.maxLength
					? `must be exactly ${rules.minLength} characters (got ${value.length})`
					: `must be at least ${rules.minLength} characters (got ${value.length})`,
				itemIndex,
			);
		}
		if (rules.maxLength !== undefined && value.length > rules.maxLength) {
			fail(node, field, `must be at most ${rules.maxLength} characters (got ${value.length})`, itemIndex);
		}

		const format = rules.format ? FORMAT_CHECKS[rules.format] : undefined;
		if (format && !format.test.test(value)) {
			fail(node, field, `must be ${format.expected}`, itemIndex);
		}

		if (rules.pattern !== undefined && !new RegExp(rules.pattern).test(value)) {
			fail(node, field, `does not match the format the API expects (${rules.pattern})`, itemIndex);
		}
	}

	if (typeof value === 'number') {
		if (rules.minimum !== undefined) {
			if (rules.exclusiveMinimum === true && value <= rules.minimum) {
				fail(node, field, `must be greater than ${rules.minimum}`, itemIndex);
			}
			if (rules.exclusiveMinimum !== true && value < rules.minimum) {
				fail(node, field, `must be ${rules.minimum} or more`, itemIndex);
			}
		}
		if (rules.maximum !== undefined && value > rules.maximum) {
			fail(node, field, `must be ${rules.maximum} or less`, itemIndex);
		}
		if (rules.multipleOf !== undefined) {
			// multipleOf 0.0001 means "at most 4 decimals"; compare in integer space.
			const scaled = Math.round(value / rules.multipleOf);
			if (Math.abs(scaled * rules.multipleOf - value) > 1e-9) {
				const decimals = Math.max(0, Math.round(-Math.log10(rules.multipleOf)));
				fail(node, field, `supports at most ${decimals} decimal places`, itemIndex);
			}
		}
	}
}

/** Validates one field's value, descending into lists and nested collections. */
export function validateField(
	node: INode,
	field: GeneratedField,
	value: unknown,
	itemIndex: number,
): void {
	if (value === undefined || value === null || value === '') {
		if (field.required) fail(node, field, 'is required', itemIndex);
		return;
	}

	if (Array.isArray(value) && field.type !== 'fixedCollection') {
		if (field.validation?.minItems !== undefined && value.length < field.validation.minItems) {
			fail(node, field, `needs at least ${field.validation.minItems} value(s)`, itemIndex);
		}
		for (const entry of value) validateScalar(node, field, entry, itemIndex);
		return;
	}

	if (field.type === 'fixedCollection') {
		const inner = (value as IDataObject).value;
		const entries = (Array.isArray(inner) ? inner : [inner ?? {}]) as IDataObject[];

		if (field.multipleValues === true && field.validation?.minItems !== undefined) {
			const filled = entries.filter((entry) => Object.keys(entry).length > 0);
			if (filled.length < field.validation.minItems) {
				fail(node, field, `needs at least ${field.validation.minItems} entry/entries`, itemIndex);
			}
		}

		for (const entry of entries) {
			for (const child of field.fields ?? []) {
				if (!isVisible(child, entry)) continue;
				validateField(node, child, entry[child.name], itemIndex);
			}
		}
		return;
	}

	validateScalar(node, field, value, itemIndex);
}

/** Validates every field of an operation against the values collected from the UI. */
export function validateFields(
	node: INode,
	fields: GeneratedField[],
	values: IDataObject,
	itemIndex: number,
): void {
	for (const field of fields) {
		validateField(node, field, values[field.name], itemIndex);
	}
}
