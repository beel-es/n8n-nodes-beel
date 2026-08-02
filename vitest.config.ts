import { defineConfig } from 'vitest/config';

export default defineConfig({
	logLevel: 'error',
	test: {
		include: ['test/**/*.test.ts'],
		coverage: {
			include: ['nodes/**/*.ts', 'credentials/**/*.ts'],
			exclude: ['nodes/**/generated/**'],
		},
	},
});
