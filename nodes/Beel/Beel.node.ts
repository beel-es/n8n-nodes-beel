import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	GENERATED_OPERATIONS,
	GENERATED_RESOURCES,
} from './descriptions/generated/operations.generated';
import type { GeneratedOperation } from './descriptions/generated/types';
import {
	buildOperationProperties,
	buildOperationSelector,
	mergeProperties,
} from './descriptions/propertyBuilder';
import { getCompanies, getCustomers, getProducts, getSeries } from './GenericFunctions';
import { executeGeneratedOperation } from './genericExecutor';
import {
	downloadInvoicePdf,
	MANUAL_OPERATIONS,
	MANUAL_PROPERTIES,
	submitRepresentation,
} from './manualOperations';

/** Everything the node can do: generated from the contract, plus the file operations. */
const ALL_OPERATIONS: GeneratedOperation[] = [...GENERATED_OPERATIONS, ...MANUAL_OPERATIONS];

function buildProperties(): INodeProperties[] {
	const properties: INodeProperties[] = [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			default: 'invoice',
			options: GENERATED_RESOURCES.map((resource) => ({
				name: resource.displayName,
				value: resource.resource,
			})),
		},
	];

	for (const resource of GENERATED_RESOURCES) {
		const operations = ALL_OPERATIONS.filter(
			(operation) => operation.resource === resource.resource,
		);
		properties.push(buildOperationSelector(resource.resource, operations));
	}

	properties.push({
		displayName: 'Company Name or ID',
		name: 'activeCompany',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCompanies' },
		default: '',
		description:
			'Company (NIF) to operate as, for multi-NIF accounts. Leave empty to use the default set on the credential, or the company the API key is already scoped to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		options: [],
	});

	const creating = ALL_OPERATIONS.filter((operation) => operation.method === 'POST');
	properties.push({
		displayName: 'Idempotency Key',
		name: 'idempotencyKey',
		type: 'string',
		default: '',
		placeholder: '={{ $json.order_id }}',
		description:
			'Optional. Retrying with the same key returns the resource created the first time instead of creating another one. Leave empty and each run sends a fresh key, which makes a network-level retry safe but still creates a new resource if the workflow runs again. Derive it from your own data — an order ID, for instance — to make re-runs safe too.',
		displayOptions: {
			show: {
				resource: [...new Set(creating.map((operation) => operation.resource))],
				operation: [...new Set(creating.map((operation) => operation.operation))],
			},
		},
	});

	for (const operation of ALL_OPERATIONS) {
		properties.push(...buildOperationProperties(operation));
	}

	properties.push(...MANUAL_PROPERTIES);

	return mergeProperties(properties);
}

export class Beel implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BeeL',
		name: 'beel',
		icon: { light: 'file:beel.svg', dark: 'file:beel.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Issue invoices and manage customers, products and series in BeeL',
		defaults: { name: 'BeeL' },
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'beelApi', required: true }],
		properties: buildProperties(),
	};

	methods = {
		loadOptions: { getCompanies, getCustomers, getProducts, getSeries },
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operationName = this.getNodeParameter('operation', 0) as string;

		const operation = ALL_OPERATIONS.find(
			(candidate) => candidate.resource === resource && candidate.operation === operationName,
		);

		if (!operation) {
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operationName}" is not supported for resource "${resource}"`,
			);
		}

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				if (resource === 'invoice' && operationName === 'downloadPdf') {
					returnData.push(await downloadInvoicePdf.call(this, itemIndex));
					continue;
				}

				if (resource === 'company' && operationName === 'submitRepresentation') {
					returnData.push(await submitRepresentation.call(this, itemIndex));
					continue;
				}

				const results = await executeGeneratedOperation.call(this, operation, itemIndex);

				returnData.push(
					...results.map((json) => ({ json, pairedItem: { item: itemIndex } })),
				);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
