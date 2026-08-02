const baseConfig = require('./.eslintrc.js');

module.exports = {
	...baseConfig,
	overrides: [
		...baseConfig.overrides,
		{
			files: ['package.json'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			rules: {
				'n8n-nodes-base/community-package-json-name-still-default': 'error',
			},
		},
	],
};
