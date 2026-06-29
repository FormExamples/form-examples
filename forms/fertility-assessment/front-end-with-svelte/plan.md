# Plan: Fertility Assessment — consolidated front-end (SvelteKit)

## Current status

Complete. The consolidated front-end is implemented: a single continuous
ten-step wizard, a SVAR DataGrid clinician dashboard, a graded report view,
and a server-rendered PDF endpoint.

## Implemented

- NICE CG156 scoring engine in `src/lib/engine/` (`types.ts`, `rules.ts`,
  `fertility-grader.ts`, `flagged-issues.ts`, `utils.ts`) with Vitest tests
  in `fertility-grader.test.ts`.
- Ten step components in `src/lib/components/steps/`.
- id-keyed reactive store `src/lib/stores/assessment.svelte.ts`.
- RESTful routes under `src/routes/fertility-assessments/`.
- Engine-derived sample records and dashboard rows in
  `src/lib/data/sample-reports.ts`.
- Lily Design System themes and `ThemeSelect` wiring.
