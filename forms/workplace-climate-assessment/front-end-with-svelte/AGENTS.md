# Workplace Climate Assessment — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid. Vitest for unit
tests.

Consolidated gold front-end: anonymous questionnaire wizard
(`/workplace-climate-assessments/[id]`) + leadership dashboard
(`/workplace-climate-assessments`), sharing one pure scoring engine in
`src/lib/engine/` (`types.ts`, `rules.ts`, `grader.ts`, `flagged-issues.ts`,
`utils.ts`; tests in `grader.test.ts`).

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
