import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// formexamples.github.io serves this form at /<SLUG>/ (spec/monorepo-github-pages/):
// with VITE_FORM_EXAMPLES_SITE=1 it builds statically, its assets under /_app/<SLUG>/.
const SLUG = 'eye-prescription';
const site = process.env.VITE_FORM_EXAMPLES_SITE === '1';
const adapter = () =>
  site
    ? adapterStatic({
        pages: 'build',
        assets: 'build',
        fallback: `${SLUG}/200.html`,
        strict: false
      })
    : adapterAuto();
const siteKit = site
  ? {
      appDir: `_app/${SLUG}`,
      prerender: {
        entries: [`/${SLUG}/`],
        handleHttpError: 'warn' as const,
        handleMissingId: 'warn' as const
      }
    }
  : {};

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({ preprocess: vitePreprocess(), adapter: adapter(), ...siteKit })
  ]
});
