# International Patient Summary — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

See parent [`../index.md`](../index.md) for the form specification.

- Engine: `src/lib/engine/` (`types.ts`, `ips-rules.ts`, `ips-grader.ts`,
  `flagged-issues.ts`, `utils.ts`); tests in `ips-grader.test.ts`.
- Store: `src/lib/stores/assessment.svelte.ts` (exports `assessment`,
  id-keyed, localStorage key `international-patient-summary.front-end-with-svelte.<id>.v1`).
- Routes: `/international-patient-summaries/` (SVAR dashboard, `ssr = false`),
  `/international-patient-summaries/[id]` (wizard), `[id]/report`, `[id]/report/pdf`.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
