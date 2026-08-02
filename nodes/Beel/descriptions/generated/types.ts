/**
 * Shape of the metadata emitted by `scripts/generate.ts` from `openapi/public-api.yaml`.
 *
 * The generator only describes *what* each operation looks like. Turning that into
 * n8n `INodeProperties` lives in `../propertyBuilder.ts`, and executing it lives in
 * `../../execute/genericExecutor.ts`. Keeping the generated artefact declarative is
 * what makes it safe to regenerate whenever the contract changes.
 */

export type GeneratedFieldType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'options'
	| 'json'
	| 'fixedCollection';

export interface GeneratedFieldOption {
	name: string;
	value: string | number;
	description?: string;
}

/** Constraints copied verbatim from the contract, enforced before the request goes out. */
export interface GeneratedValidation {
	pattern?: string;
	minLength?: number;
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: boolean;
	multipleOf?: number;
	minItems?: number;
	/** OpenAPI `format`, e.g. `date`, `date-time`, `email`, `uri`, `uuid`. */
	format?: string;
}

export interface GeneratedField {
	/** n8n parameter name. */
	name: string;
	/** Property name expected by the API (differs when a name had to be disambiguated). */
	apiName: string;
	displayName: string;
	type: GeneratedFieldType;
	default: unknown;
	description?: string;
	placeholder?: string;
	required?: boolean;
	/** Allows the user to add several values (rendered as a list). */
	multipleValues?: boolean;
	options?: GeneratedFieldOption[];
	/** Nested scalar fields, for `fixedCollection`. */
	fields?: GeneratedField[];

	/**
	 * Required inside its own nested object (`apiName` has a dotted path), even
	 * when that object is optional on the request.
	 */
	groupRequired?: boolean;
	/**
	 * Shows the field only when a sibling in the same collection has one of these
	 * values — used where a field's valid values depend on another field, such as
	 * the tax percentage depending on the tax type.
	 */
	showWhen?: { field: string; values: Array<string | number> };
	/** `loadOptionsMethod` to attach, for resource dropdowns such as series or customers. */
	loadOptionsMethod?: string;
	numberPrecision?: number;
	validation?: GeneratedValidation;
}

export interface GeneratedResource {
	resource: string;
	displayName: string;
}

export interface GeneratedOperation {
	resource: string;
	operation: string;
	/** Label shown in the Operation dropdown. */
	displayName: string;
	/** Subtitle shown on the node canvas. */
	action: string;
	description: string;
	operationId: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Path template with `{placeholders}`, relative to the API base URL. */
	path: string;
	pathParams: GeneratedField[];
	/** Required fields, rendered as top-level properties. */
	requiredFields: GeneratedField[];
	/** Optional body fields, grouped in a collection. */
	optionalFields: GeneratedField[];
	/** Optional query-string filters, grouped in a collection. */
	filters: GeneratedField[];
	/** Name of the collection holding `optionalFields` (`additionalFields`, `updateFields`, `options`). */
	optionalCollectionName: string;
	/** Query-string parameter names, so the executor knows what is not body. */
	queryParamNames: string[];
	/** Whether the endpoint is paginated and should offer Return All / Limit. */
	paginated: boolean;
	/** Whether the response is a collection, so each element becomes its own item. */
	isList: boolean;
	/** Key holding the array inside `data`; empty when `data` is the array itself. */
	listKey: string;
}
