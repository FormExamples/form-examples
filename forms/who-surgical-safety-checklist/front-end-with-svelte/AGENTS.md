# WHO Surgical Safety Checklist — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for engine unit tests.

Consolidated gold front-end: one continuous single-page wizard plus the SVAR
DataGrid clinician dashboard, with RESTful routes
(`/who-surgical-safety-checklists/` list + `/who-surgical-safety-checklists/[id]`
form). The reactive store is `src/lib/stores/checklist.svelte.ts` (exporting
`store`); the pure engine lives in `src/lib/checklist/`.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
