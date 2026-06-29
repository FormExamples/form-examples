# Angiography Test Request — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 (Lily Design System tokens).
Vitest for the engine unit tests.

Consolidated `front-end-with-svelte`: a single-page seven-step request wizard
and a SVAR DataGrid vetting dashboard, sharing one pure four-axis grading
engine. The reactive store is `src/lib/stores/request.svelte.ts` (exports
`request`); the engine lives in `src/lib/engine/` (`types.ts`, `defaults.ts`,
`rules.ts`, `flags.ts`, `grader.ts`, `utils.ts`, `grader.test.ts`).

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
