import { createHmac } from 'crypto';

import { describe, expect, it } from 'vitest';

import { BeelTrigger } from '../nodes/BeelTrigger/BeelTrigger.node';
import { makeContext } from './helpers';

/**
 * The trigger is the security boundary of this package: anything that reaches a
 * workflow through it must have been signed by BeeL. These cover the signature,
 * the replay window and the subscription lifecycle.
 */

const SECRET = 'whsec_test_secret';
const EVENT = {
	id: '3f7a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
	type: 'verifactu.status.updated',
	data: { invoice_id: 'inv-1', new_status: 'ACCEPTED' },
};

function signed(body: string, secret = SECRET, at = Math.floor(Date.now() / 1000)) {
	const signature = createHmac('sha256', secret).update(`${at}.${body}`, 'utf8').digest('hex');
	return `t=${at},v1=${signature}`;
}

async function deliver(options: {
	body?: string;
	signature?: string;
	secret?: string;
	parameters?: Record<string, unknown>;
}) {
	const body = options.body ?? JSON.stringify(EVENT);
	// An absent key means "sign it for me"; an explicit undefined means "send no
	// signature header at all".
	const signature = 'signature' in options ? options.signature : signed(body);
	const stub = makeContext({
		staticData: { webhookId: 'sub-1', secret: options.secret ?? SECRET },
		headers: {
			'beel-signature': signature,
			'beel-event-id': EVENT.id,
			'beel-delivery-id': 'delivery-1',
			'beel-event': EVENT.type,
		},
		rawBody: Buffer.from(body, 'utf8'),
		parameters: { options: {}, ...options.parameters },
	});

	return await new BeelTrigger().webhook.call(stub.context);
}

describe('verifying a delivery', () => {
	it('accepts a correctly signed event', async () => {
		const response = await deliver({});

		expect(response.workflowData?.[0]).toEqual([{ json: EVENT }]);
	});

	it('rejects a tampered body', async () => {
		const signature = signed(JSON.stringify(EVENT));
		const response = await deliver({
			body: JSON.stringify({ ...EVENT, data: { new_status: 'REJECTED' } }),
			signature,
		});

		expect(response.workflowData).toBeUndefined();
		expect(response.webhookResponse).toMatchObject({ status: 401 });
	});

	it('rejects a signature made with another secret', async () => {
		const body = JSON.stringify(EVENT);
		const response = await deliver({ body, signature: signed(body, 'whsec_wrong') });

		expect(response.workflowData).toBeUndefined();
	});

	it('rejects a delivery older than the tolerance', async () => {
		const body = JSON.stringify(EVENT);
		const old = Math.floor(Date.now() / 1000) - 3600;
		const response = await deliver({ body, signature: signed(body, SECRET, old) });

		expect(response.workflowData).toBeUndefined();
		expect((response.webhookResponse as { body: { error: string } }).body.error).toMatch(/older/);
	});

	it('accepts an old delivery when the tolerance is disabled', async () => {
		const body = JSON.stringify(EVENT);
		const old = Math.floor(Date.now() / 1000) - 3600;
		const response = await deliver({
			body,
			signature: signed(body, SECRET, old),
			parameters: { options: { toleranceSeconds: 0 } },
		});

		expect(response.workflowData).toBeDefined();
	});

	it('rejects a missing or malformed signature header', async () => {
		expect((await deliver({ signature: undefined as never })).workflowData).toBeUndefined();
		expect((await deliver({ signature: 'garbage' })).workflowData).toBeUndefined();
		expect((await deliver({ signature: 't=abc,v1=xx' })).workflowData).toBeUndefined();
	});

	it('rejects a body that is not JSON', async () => {
		const response = await deliver({ body: 'not json' });

		expect(response.workflowData).toBeUndefined();
	});

	it('rejects everything when no secret is stored', async () => {
		const body = JSON.stringify(EVENT);
		const stub = makeContext({
			staticData: {},
			headers: { 'beel-signature': signed(body) },
			rawBody: Buffer.from(body, 'utf8'),
			parameters: { options: {} },
		});

		const response = await new BeelTrigger().webhook.call(stub.context);
		expect(response.workflowData).toBeUndefined();
	});

	it('adds the delivery headers when asked, for deduplication', async () => {
		const response = await deliver({ parameters: { options: { includeHeaders: true } } });

		expect(response.workflowData?.[0][0].json.delivery).toEqual({
			event_id: EVENT.id,
			delivery_id: 'delivery-1',
			event_type: EVENT.type,
		});
	});
});

describe('the subscription lifecycle', () => {
	const trigger = new BeelTrigger();
	const methods = trigger.webhookMethods.default;

	it('registers the endpoint and stores the signing secret', async () => {
		const stub = makeContext({
			parameters: { events: ['invoice.issued'], activeCompany: '' },
			responses: { data: { id: 'sub-1', secret: SECRET } },
			staticData: {},
		});

		await methods.create.call(stub.context);

		expect(stub.requests[0]).toMatchObject({
			method: 'POST',
			url: 'https://app.beel.es/api/v1/webhooks',
			body: { url: 'https://n8n.example.com/webhook/beel', events: ['invoice.issued'] },
		});
		expect(stub.staticData).toEqual({ webhookId: 'sub-1', secret: SECRET });
	});

	it('refuses to subscribe with no events selected', async () => {
		const stub = makeContext({ parameters: { events: [], activeCompany: '' }, staticData: {} });

		await expect(methods.create.call(stub.context)).rejects.toThrow(/at least one event/);
	});

	it('fails loudly when no signing secret comes back', async () => {
		const stub = makeContext({
			parameters: { events: ['invoice.issued'], activeCompany: '' },
			responses: { data: { id: 'sub-1' } },
			staticData: {},
		});

		await expect(methods.create.call(stub.context)).rejects.toThrow(/signing secret/);
	});

	it('treats an unknown subscription as missing', async () => {
		const stub = makeContext({
			parameters: { events: ['invoice.issued'], activeCompany: '' },
			responses: { data: { webhooks: [] } },
			staticData: { webhookId: 'sub-1', secret: SECRET },
		});

		expect(await methods.checkExists.call(stub.context)).toBe(false);
		expect(stub.staticData).toEqual({});
	});

	it('accepts a subscription that still matches', async () => {
		const stub = makeContext({
			parameters: { events: ['invoice.issued'], activeCompany: '' },
			responses: {
				data: {
					webhooks: [
						{
							id: 'sub-1',
							url: 'https://n8n.example.com/webhook/beel',
							events: ['invoice.issued'],
							active: true,
						},
					],
				},
			},
			staticData: { webhookId: 'sub-1', secret: SECRET },
		});

		expect(await methods.checkExists.call(stub.context)).toBe(true);
		expect(stub.requests).toHaveLength(1);
	});

	it('realigns a subscription whose events drifted, keeping the secret', async () => {
		const stub = makeContext({
			parameters: { events: ['invoice.issued', 'invoice.cancelled'], activeCompany: '' },
			responses: {
				data: {
					webhooks: [
						{
							id: 'sub-1',
							url: 'https://n8n.example.com/webhook/beel',
							events: ['invoice.issued'],
							active: true,
						},
					],
				},
			},
			staticData: { webhookId: 'sub-1', secret: SECRET },
		});

		expect(await methods.checkExists.call(stub.context)).toBe(true);
		expect(stub.requests[1]).toMatchObject({
			method: 'PATCH',
			url: 'https://app.beel.es/api/v1/webhooks/sub-1',
		});
		expect(stub.staticData.secret).toBe(SECRET);
	});

	it('deletes the subscription and forgets the secret', async () => {
		const stub = makeContext({
			parameters: { activeCompany: '' },
			staticData: { webhookId: 'sub-1', secret: SECRET },
		});

		await methods.delete.call(stub.context);

		expect(stub.requests[0]).toMatchObject({
			method: 'DELETE',
			url: 'https://app.beel.es/api/v1/webhooks/sub-1',
		});
		expect(stub.staticData).toEqual({});
	});

	it('forgets the secret even when the API says the subscription is gone', async () => {
		const stub = makeContext({
			parameters: { activeCompany: '' },
			error: { statusCode: 404 },
			staticData: { webhookId: 'sub-1', secret: SECRET },
		});

		await methods.delete.call(stub.context);

		expect(stub.staticData).toEqual({});
	});
});
