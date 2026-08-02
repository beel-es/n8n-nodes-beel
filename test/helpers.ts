import type { IDataObject } from 'n8n-workflow';

import { GENERATED_OPERATIONS } from '../nodes/Beel/descriptions/generated/operations.generated';
import { MANUAL_OPERATIONS } from '../nodes/Beel/manualOperations';
import type { GeneratedOperation } from '../nodes/Beel/descriptions/generated/types';

/** Stands in for the n8n execution context, recording what the node would send. */
export interface StubContext {
	requests: IDataObject[];
	binary: Record<string, { data: Buffer; fileName?: string; mimeType?: string }>;
	staticData: IDataObject;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	context: any;
}

export interface StubOptions {
	parameters?: Record<string, unknown>;
	credentials?: IDataObject;
	/** Response for each call, in order; a single value is reused for all of them. */
	responses?: unknown | unknown[];
	/** Throws this instead of responding, to exercise error handling. */
	error?: unknown;
	binary?: Record<string, { data: Buffer; fileName?: string; mimeType?: string }>;
	staticData?: IDataObject;
	headers?: IDataObject;
	rawBody?: Buffer;
	continueOnFail?: boolean;
	inputItems?: number;
}

const UNSET = Symbol('unset');

export function makeContext(options: StubOptions = {}): StubContext {
	const requests: IDataObject[] = [];
	const parameters = options.parameters ?? {};
	const binary = options.binary ?? {};
	const staticData = options.staticData ?? {};

	let call = 0;
	const respond = (): unknown => {
		if (options.error !== undefined) throw options.error;
		// `responses: undefined` has to mean "204 No Content", so tell an explicit
		// undefined apart from the key being absent.
		if (!('responses' in options)) return { data: {} };
		const responses = options.responses;
		if (Array.isArray(responses)) return responses[Math.min(call++, responses.length - 1)];
		return responses;
	};

	const context = {
		getNode: () => ({ name: 'BeeL', type: 'beel', typeVersion: 1, position: [0, 0], parameters: {} }),
		getNodeParameter: (name: string, _itemIndex?: unknown, fallback: unknown = UNSET) => {
			if (name in parameters) return parameters[name];
			if (fallback !== UNSET) return fallback;
			throw new Error(`Test did not provide the parameter "${name}"`);
		},
		getCurrentNodeParameter: (name: string) => parameters[name],
		getCredentials: async () => options.credentials ?? { apiKey: 'beel_sk_test_x' },
		getInputData: () => Array.from({ length: options.inputItems ?? 1 }, () => ({ json: {} })),
		continueOnFail: () => options.continueOnFail === true,
		getWorkflowStaticData: () => staticData,
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/beel',
		getHeaderData: () => options.headers ?? {},
		getRequestObject: () => ({ rawBody: options.rawBody }),
		logger: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} },
		helpers: {
			httpRequestWithAuthentication: async (_credential: string, request: IDataObject) => {
				requests.push(request);
				return respond();
			},
			httpRequest: async (request: IDataObject) => {
				requests.push(request);
				return respond();
			},
			assertBinaryData: (_itemIndex: number, field: string) => {
				const entry = binary[field];
				if (!entry) throw new Error(`No binary data in field "${field}"`);
				return { fileName: entry.fileName, mimeType: entry.mimeType };
			},
			getBinaryDataBuffer: async (_itemIndex: number, field: string) => binary[field].data,
			prepareBinaryData: async (buffer: Buffer, fileName: string, mimeType: string) => ({
				data: buffer.toString('base64'),
				fileName,
				mimeType,
			}),
			returnJsonArray: (items: IDataObject[]) => items.map((json) => ({ json })),
		},
	};

	return { requests, binary, staticData, context };
}

/** Looks up an operation the node implements, generated or hand-written. */
export function operationFor(resource: string, operation: string): GeneratedOperation {
	const found = [...GENERATED_OPERATIONS, ...MANUAL_OPERATIONS].find(
		(candidate) => candidate.resource === resource && candidate.operation === operation,
	);
	if (!found) throw new Error(`No operation ${resource}.${operation}`);
	return found;
}

export const INVOICE_ID = '550e8400-e29b-41d4-a716-446655440000';
export const CUSTOMER_ID = '4f244735-980b-8d9c-80e8-6331fa0b1958';
export const SERIES_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
export const COMPANY_ID = '660e8400-e29b-41d4-a716-446655440001';
