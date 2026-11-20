import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const SLUG = 'pre-operative-assessment-by-clinician';
const site = process.env.VITE_FORM_EXAMPLES_SITE === '1';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: site
        ? adapterStatic({
            pages: 'build',
            assets: 'build',
            fallback: `${SLUG}/200.html`,
            strict: false
          })
        : adapterAuto(),
      ...(site
        ? {
            appDir: `_app/${SLUG}`,
            prerender: { entries: [`/${SLUG}/`], handleHttpError: 'warn', handleMissingId: 'warn' }
          }
        : {})
    })
  ]
});
