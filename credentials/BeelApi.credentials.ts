import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class BeelApi implements ICredentialType {
	name = 'beelApi';

	displayName = 'BeeL API';

	documentationUrl = 'https://docs.beel.es';

	icon: Icon = 'file:beel.svg';

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
				'Optional. UUID of the company (NIF) every node should operate as by default, sent as the <code>Beel-Active-Company</code> header. Only relevant for multi-NIF accounts using an account-wide API key; a company-scoped key already resolves its own company. Each node can override it with its own Company field.',
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

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl.replace(new RegExp("/$"), "")}}',
			url: '/v1/configuration/series',
			method: 'GET',
		},
	};
}
