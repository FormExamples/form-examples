import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	// The store is a `.svelte.ts` runes module; the Svelte plugin compiles its
	// `$state` / `$effect` runes so engine tests can import its factories.
	plugins: [svelte({ compilerOptions: { runes: true } })],
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, 'src/lib'),
			// SvelteKit's `$app/*` ambient modules are not available under plain
			// Vitest; stub `$app/environment` so engine tests can import the store.
			'$app/environment': path.resolve(__dirname, 'src/lib/test/app-environment-mock.ts')
		}
	},
	test: {
		include: ['src/**/*.test.ts']
	}
});
