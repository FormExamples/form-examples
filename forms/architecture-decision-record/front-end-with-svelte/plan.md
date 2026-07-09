# front-end-with-svelte — Plan

SvelteKit 2 + Svelte 5 implementation of the 16-step ADR wizard.

## Approach

- Single-page wizard. All 16 step components are rendered in
  `routes/+page.svelte` and displayed as a scrollable list.
- Reactive state via Svelte 5 `$state` rune in
  `lib/stores/adr.svelte.ts`. The store is a singleton; components bind
  directly to `store.data.*`.
- Markdown rendering on a separate `/report` route.

## Tech

- SvelteKit 2.15+, Svelte 5.2+
- Tailwind 4 via `@tailwindcss/vite`
- TypeScript strict
- No runtime dependencies beyond Svelte itself
