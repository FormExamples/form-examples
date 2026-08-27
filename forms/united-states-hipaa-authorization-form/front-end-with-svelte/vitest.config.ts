import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, 'src/lib'),
			'$app/env': path.resolve(__dirname, 'src/test/app-environment-stub.ts')
		}
	},
	test: {
		include: ['src/**/*.test.ts']
	}
});
