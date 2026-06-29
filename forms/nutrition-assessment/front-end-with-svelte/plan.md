# Plan: Nutrition Assessment — patient form (SvelteKit)

## Current status

Complete. Consolidated gold front-end built from the cardiology-assessment
template and the HTML reference implementation.

- Pure MUST scoring engine in `src/lib/engine/` (`types.ts`, `must-rules.ts`,
  `nutrition-grader.ts`, `flagged-issues.ts`, `utils.ts`) with Vitest tests.
- Ten step components in `src/lib/components/steps/`.
- Id-keyed reactive store in `src/lib/stores/assessment.svelte.ts`.
- RESTful routes: `/nutrition-assessments/` (SVAR dashboard),
  `/nutrition-assessments/[id]` (wizard), `[id]/report`, `[id]/report/pdf`.
- Welcome page and themed layout (45 Lily themes + ThemeSelect).

## Future work

- Wire the dashboard to the live back-end API (currently sample-data fallback).
