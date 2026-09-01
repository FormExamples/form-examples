import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter(),
			// SvelteKit 3 removed the built-in $lib alias in favour of `#lib`
			// subpath imports; keep $lib so this form matches the rest of the
			// fleet, which is still on a pre-removal `next` snapshot.
			alias: { $lib: 'src/lib' }
		})
	]
});
