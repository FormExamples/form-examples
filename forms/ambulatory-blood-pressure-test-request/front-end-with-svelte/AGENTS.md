# Ambulatory Blood Pressure Test Request — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Consolidated gold front-end: single-page wizard + SVAR DataGrid vetting
dashboard, RESTful routes under `/ambulatory-blood-pressure-test-requests/`.
The reactive store is `src/lib/stores/request.svelte.ts` (exports `request`);
the pure four-axis engine lives in `src/lib/engine/`.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
