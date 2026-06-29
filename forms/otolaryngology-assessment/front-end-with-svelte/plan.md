# Plan: Otolaryngology Assessment — front-end (SvelteKit)

## Current status

Complete. Consolidated gold front-end: ten-section single-page wizard,
SVAR DataGrid clinician dashboard, graded report, and server-side PDF.

## Architecture

- Scoring engine in `src/lib/engine/` (`types.ts`, `snot22-rules.ts`,
  `snot22-grader.ts`, `flagged-issues.ts`, `utils.ts`) with Vitest tests
  (`snot22-grader.test.ts`).
- Step components in `src/lib/components/steps/` (Step1..Step10).
- Reactive store in `src/lib/stores/assessment.svelte.ts` (id-keyed,
  localStorage-persisted, in-place deep-merge).
- RESTful routes under `src/routes/otolaryngology-assessments/`.
- Lily Design System headless UI in `src/lib/components/ui/`; 45 vendored
  themes under `static/themes/` with a swappable theme `<link>`.
