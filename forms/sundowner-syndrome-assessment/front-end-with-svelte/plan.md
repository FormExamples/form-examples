# Plan: Sundowner Syndrome Assessment — consolidated front-end (SvelteKit)

## Current status

Implemented. Consolidated gold front-end built from the canonical
`cardiology-assessment/front-end-with-svelte` template, with the scoring
engine, steps, and content ported from `../front-end-form-with-html/`.

- Scoring engine in `src/lib/engine/` (CMAI + NPI) with Vitest tests.
- Ten step components in `src/lib/components/steps/`.
- Id-keyed reactive store in `src/lib/stores/assessment.svelte.ts`.
- RESTful routes: `/`, `/sundowner-syndrome-assessments`,
  `/sundowner-syndrome-assessments/[id]`, `[id]/report`, `[id]/report/pdf`.
- SVAR DataGrid dashboard with engine-derived sample rows.
- 45 Lily themes + ThemeSelect.

## Future work

- Wire the dashboard to the live back-end API (currently sample data).
