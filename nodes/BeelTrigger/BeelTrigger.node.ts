import { createHmac, timingSafeEqual } from 'crypto';

import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { beelApiRequest, getCompanies, unwrap, WEBHOOK_EVENTS } from '../Beel/GenericFunctions';

/** Default freshness window for a delivery, matching the BeeL SDK. */
const DEFAULT_TOLERANCE_SECONDS = 300;

interface BeelWebhookState {
	webhookId?: string;
	secret?: string;
}

/**
 * Parses `BeeL-Signature: t=<unix>,v1=<hex>`.
 */
function parseSignature(header: string): { timestamp: number; signature: string } | undefined {
	let timestamp: number | undefined;
	let signature: string | undefined;

	for (const part of header.split(',')) {
		const separator = part.indexOf('=');
		if (separator === -1) continue;

		const key = part.slice(0, separator).trim();
		const value = part.slice(separator + 1).trim();

		if (key === 't') timestamp = Number.parseInt(value, 10);
		else if (key === 'v1') signature = value;
	}

	if (timestamp === undefined || Number.isNaN(timestamp) || !signature) return undefined;
	return { timestamp, signature };
}

function timingSafeEquals(a: string, b: string): boolean {
	const bufferA = Buffer.from(a, 'utf8');
	const bufferB = Buffer.from(b, 'utf8');
	return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

export class BeelTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BeeL Trigger',
		name: 'beelTrigger',
		icon: { light: 'file:beel.svg', dark: 'file:beel.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when BeeL emits an event',
		defaults: { name: 'BeeL Trigger' },
		inputs: [],
		outputs: ['main'],
		credentials: [{ name: 'beelApi', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
				// Signatures are computed over the exact bytes BeeL sent, so the body
				// must not be re-serialised before verification.
				rawBody: true,
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'Events that should start the workflow',
				options: WEBHOOK_EVENTS.map((event) => ({
					name: event.name,
					value: event.value,
					description: event.description,
				})),
			},
			{
				displayName: 'Company Name or ID',
				name: 'companyId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCompanies' },
				default: '',
				description:
					'Company (NIF) to subscribe on, for multi-NIF accounts. Leave empty to use the default set on the credential. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				options: [],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				options: [
					{
						displayName: 'Signature Tolerance (Seconds)',
						name: 'toleranceSeconds',
						type: 'number',
						default: DEFAULT_TOLERANCE_SECONDS,
						typeOptions: { minValue: 0 },
						description:
							'Maximum age of a delivery, to reject replayed requests. Set to 0 to disable the age check.',
					},
					{
						displayName: 'Include Delivery Headers',
						name: 'includeHeaders',
						type: 'boolean',
						default: false,
						description:
							'Whether to add the BeeL delivery headers (event ID, delivery ID) to the output, for deduplication',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: { getCompanies },
	};

	webhookMethods = {
		default: {
			/**
			 * Confirms the stored subscription still exists and still matches the
			 * configured events; anything else is recreated.
			 */
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const state = this.getWorkflowStaticData('node') as BeelWebhookState;
				if (!state.webhookId || !state.secret) return false;

				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const companyId = (this.getNodeParameter('companyId', '') as string) ?? '';

				const response = unwrap(
					await beelApiRequest.call(this, 'GET', '/v1/webhooks', undefined, {}, companyId),
				);
				const subscriptions = ((response.webhooks ?? response) ?? []) as IDataObject[];

				const existing = (Array.isArray(subscriptions) ? subscriptions : []).find(
					(subscription) => subscription.id === state.webhookId,
				);

				if (!existing) {
					delete state.webhookId;
					delete state.secret;
					return false;
				}

				const subscribed = (existing.events ?? []) as string[];
				const sameEvents =
					subscribed.length === events.length && events.every((event) => subscribed.includes(event));

				if (existing.url === webhookUrl && sameEvents && existing.active !== false) return true;

				// Bring the subscription back in line without losing the signing secret.
				await beelApiRequest.call(
					this,
					'PATCH',
					`/v1/webhooks/${state.webhookId}`,
					{ url: webhookUrl, events, active: true },
					{},
					companyId,
				);

				return true;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events') as string[];
				const companyId = (this.getNodeParameter('companyId', '') as string) ?? '';

				if (events.length === 0) {
					throw new NodeOperationError(this.getNode(), 'Select at least one event to subscribe to');
				}

				if (!webhookUrl.startsWith('https://')) {
					throw new NodeOperationError(
						this.getNode(),
						'BeeL only delivers webhooks to HTTPS endpoints',
						{
							description:
								'The n8n instance must be reachable over HTTPS. While developing locally, use a tunnel (`n8n start --tunnel`).',
						},
					);
				}

				const subscription = unwrap(
					await beelApiRequest.call(
						this,
						'POST',
						'/v1/webhooks',
						{ url: webhookUrl, events },
						{},
						companyId,
					),
				);

				if (!subscription.secret) {
					throw new NodeOperationError(
						this.getNode(),
						'BeeL did not return a signing secret for the subscription',
						{ description: 'Without it, deliveries cannot be verified.' },
					);
				}

				const state = this.getWorkflowStaticData('node') as BeelWebhookState;
				state.webhookId = subscription.id as string;
				state.secret = subscription.secret as string;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const state = this.getWorkflowStaticData('node') as BeelWebhookState;
				if (!state.webhookId) return true;

				const companyId = (this.getNodeParameter('companyId', '') as string) ?? '';

				try {
					await beelApiRequest.call(
						this,
						'DELETE',
						`/v1/webhooks/${state.webhookId}`,
						undefined,
						{},
						companyId,
					);
				} catch {
					// Already gone on BeeL's side; drop the local state either way.
					return false;
				} finally {
					delete state.webhookId;
					delete state.secret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const request = this.getRequestObject();
		const headers = this.getHeaderData() as IDataObject;
		const state = this.getWorkflowStaticData('node') as BeelWebhookState;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		const reject = (reason: string): IWebhookResponseData => ({
			webhookResponse: { status: 401, body: { error: reason } },
			noWebhookResponse: false,
			workflowData: undefined,
		});

		if (!state.secret) {
			return reject('Webhook is not configured — reactivate the workflow');
		}

		const signatureHeader = (headers['beel-signature'] ?? headers['BeeL-Signature']) as
			| string
			| undefined;

		if (!signatureHeader) return reject('Missing BeeL-Signature header');

		const parsed = parseSignature(signatureHeader);
		if (!parsed) return reject('Malformed BeeL-Signature header');

		const rawBody = request.rawBody;
		if (!rawBody) {
			throw new NodeOperationError(
				this.getNode(),
				'The raw request body is unavailable, so the signature cannot be verified',
			);
		}

		const tolerance = (options.toleranceSeconds as number) ?? DEFAULT_TOLERANCE_SECONDS;
		if (tolerance > 0) {
			const age = Math.abs(Math.floor(Date.now() / 1000) - parsed.timestamp);
			if (age > tolerance) return reject(`Delivery is ${age}s old, older than the ${tolerance}s tolerance`);
		}

		const body = rawBody.toString('utf8');
		const expected = createHmac('sha256', state.secret)
			.update(`${parsed.timestamp}.${body}`, 'utf8')
			.digest('hex');

		if (!timingSafeEquals(parsed.signature, expected)) return reject('Invalid signature');

		let event: IDataObject;
		try {
			event = JSON.parse(body) as IDataObject;
		} catch {
			return reject('Body is not valid JSON');
		}

		if (options.includeHeaders === true) {
			event.delivery = {
				event_id: headers['beel-event-id'],
				delivery_id: headers['beel-delivery-id'],
				event_type: headers['beel-event'],
			};
		}

		return { workflowData: [this.helpers.returnJsonArray([event])] };
	}
}
