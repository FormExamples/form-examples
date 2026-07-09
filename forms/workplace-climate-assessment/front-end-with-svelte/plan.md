# Plan: Workplace Climate Assessment — front-end (SvelteKit)

## Current status

Consolidated gold front-end built: anonymous questionnaire wizard + SVAR
leadership dashboard + report + PDF, sharing one pure scoring engine. Replaces
the legacy split `front-end-with-svelte`
stubs.

## Structure

- `src/lib/engine/` — pure scoring engine (`types.ts`, `rules.ts`, `grader.ts`,
  `flagged-issues.ts`, `utils.ts`) with Vitest tests in `grader.test.ts`.
- `src/lib/components/steps/` — ten step components (1-indexed).
- `src/lib/components/ui/` — Lily Svelte headless component contract.
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store with
  localStorage persistence.
- `src/lib/data/sample-reports.ts` — four sample responses spanning the grade
  range plus engine-derived dashboard rows.
- `src/routes/workplace-climate-assessments/` — RESTful routes: list `/`,
  wizard `[id]`, report `[id]/report`, PDF `[id]/report/pdf`.
