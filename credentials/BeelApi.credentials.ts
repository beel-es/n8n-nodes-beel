import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

import { contractPath } from '../nodes/Beel/GenericFunctions';

export class BeelApi implements ICredentialType {
	name = 'beelApi';

	displayName = 'BeeL API';

	documentationUrl = 'https://docs.beel.es';

	icon: Icon = { light: 'file:beel.svg', dark: 'file:beel.dark.svg' };

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder: 'beel_sk_test_...',
			description:
				'API key from your BeeL dashboard. Keys starting with <code>beel_sk_test_</code> target the sandbox (no quota consumed, VeriFactu test mode); <code>beel_sk_live_</code> keys target production.',
		},
		{
			displayName: 'Default Company ID',
			name: 'companyId',
			type: 'string',
			default: '',
			placeholder: '550e8400-e29b-41d4-a716-446655440000',
			description:
				'UUID of the company (NIF) every node should operate as by default. BeeL scopes its resources by company — invoices, customers, products and series all live under one — so each node needs one: either this default or its own Company field, which overrides it. Leave empty only if every node picks its own.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.beel.es/api',
			description: 'Base URL of the BeeL API. Change it only if you were told to.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	/**
	 * Identity is the right thing to probe: it is the one endpoint that needs no
	 * company, so a green tick means "the key is valid" and nothing else. The
	 * previous probe read a company-scoped resource, which fails for a perfectly
	 * good key on an account whose default company is not set.
	 */
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl.replace(new RegExp("/$"), "")}}',
			url: contractPath('getMyIdentity'),
			method: 'GET',
		},
	};
}
