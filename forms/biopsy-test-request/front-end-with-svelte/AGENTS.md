# Biopsy Test Request — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte
headless + SVAR DataGrid. Vitest for engine unit tests.

- Store: `src/lib/stores/request.svelte.ts` (export `request`), id-keyed with
  in-place `deepAssign`; localStorage key `biopsy-test-request.front-end-with-svelte.<id>.v1`.
- Engine: `src/lib/engine/` — `defaults.ts` (`createDefaultRequest`), `types.ts`,
  `rules.ts`, `flags.ts`, `grader.ts` (`calculateGrade`), `utils.ts`,
  `grader.test.ts`. Ported from the HTML reference engine
  (`../front-end-with-html/js/`).
- Routes: `/biopsy-test-requests/` (SVAR dashboard, `ssr = false`),
  `/biopsy-test-requests/[id]` (wizard), `[id]/report`, `[id]/report/pdf`.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
