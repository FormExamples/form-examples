# Emergency Medical Technician Psychomotor Examination — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Consolidated gold front-end for the NREMT-style EMT psychomotor skills
examination. A single continuous examiner wizard captures the six sections
(candidate / scenario, scene size-up, primary survey, history & secondary
assessment, reassessment, critical-criteria review); the shared engine awards
points against the patient-assessment checklist, applies the critical-criteria
overrides, and returns an overall Pass / Fail with flagged issues.

## Routes

- `/` — welcome page with links to the form and dashboard
- `/emergency-medical-technician-psychomotor-examinations` — SVAR DataGrid dashboard
- `/emergency-medical-technician-psychomotor-examinations/[id]` — examiner wizard
- `/emergency-medical-technician-psychomotor-examinations/[id]/report` — graded report
- `/emergency-medical-technician-psychomotor-examinations/[id]/report/pdf` — PDF endpoint

## Engine

`src/lib/engine/` — `types.ts`, `rules.ts`, `psychomotor-grader.ts`,
`flagged-issues.ts`, `utils.ts`, plus `psychomotor-grader.test.ts` (Vitest).
