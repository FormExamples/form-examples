# Plan: Endocrinology Assessment — consolidated front-end (SvelteKit)

## Current status

Complete. Gold consolidated front-end: single-page wizard + SVAR dashboard +
graded report + PDF, all served from RESTful `/endocrinology-assessments`
routes. `pnpm check`, `pnpm build`, and `pnpm exec vitest run` pass.

## Structure

- `src/lib/engine/` — pure grading engine (`types.ts`, `endocrine-rules.ts`,
  `endocrine-grader.ts`, `flagged-issues.ts`, `utils.ts`) + Vitest tests.
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store with
  in-place `deepAssign` merge and localStorage persistence.
- `src/lib/components/steps/` — ten step components (one per axis / section).
- `src/lib/components/ui/` — Lily Svelte headless component contract.
- `src/lib/data/sample-reports.ts` — four engine-derived sample records.
- `src/routes/endocrinology-assessments/` — dashboard, wizard, report, PDF.
