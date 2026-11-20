import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { forms } from './src/lib/data/forms.generated.ts';

// Forms served at /<slug>/ are built and copied in after this build, by
// scripts/build-forms.mjs, so the crawler cannot find them yet.
const formApps = new Set(forms.filter((form) => form.app).map((form) => form.slug));

export default defineConfig({
  // Bundle Lily's Svelte packages for prerendering rather than leave them to
  // Node: inside the monorepo Node would otherwise reach the repo root's copy
  // of svelte-headless and fail on its raw .svelte files.
  ssr: { noExternal: [/^@lilydesignsystem\//] },
  plugins: [
    tailwindcss(),
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: undefined,
        precompress: false,
        strict: true
      }),
      prerender: {
        handleHttpError: ({ path, status, message }) => {
          if (status === 404 && formApps.has(path.split('/')[1])) return;
          throw new Error(message);
        }
      }
    })
  ]
});
