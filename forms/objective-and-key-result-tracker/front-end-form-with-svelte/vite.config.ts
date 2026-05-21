import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  // @ts-expect-error — Vitest test config; types come via vitest plugin at run time.
  test: { include: ['src/**/*.test.ts'] },
});
