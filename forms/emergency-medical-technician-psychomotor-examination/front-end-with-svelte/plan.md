# Plan: Emergency Medical Technician Psychomotor Examination — front-end (SvelteKit)

## Current status

Complete. Consolidated gold front-end: single-page examiner wizard, SVAR
DataGrid dashboard, graded report + PDF, and a pure point-based grading engine
with Vitest coverage.

## Implemented

- Point-based grading engine in `src/lib/engine/` (`types.ts`, `rules.ts`,
  `psychomotor-grader.ts`, `flagged-issues.ts`, `utils.ts`) with the NREMT
  critical-criteria overrides and the 80% pass threshold.
- Six step components in `src/lib/components/steps/` driven by a reusable
  tri-state checklist field.
- Id-keyed reactive store in `src/lib/stores/assessment.svelte.ts` with
  localStorage persistence and in-place deep-merge hydration.
- RESTful routes under
  `src/routes/emergency-medical-technician-psychomotor-examinations/`
  (dashboard list + `[id]` wizard + `[id]/report` + `[id]/report/pdf`).
- Vitest engine tests in `psychomotor-grader.test.ts`.
