# Plan: Blood Donation Assessment — front-end (SvelteKit)

## Current status

Complete consolidated gold front-end. Single continuous ten-step donor
questionnaire, clinician dashboard (SVAR DataGrid), eligibility report, and
PDF endpoint, all driven by the shared pure scoring engine.

## Structure

- `src/lib/engine/` — `types.ts`, `donor-rules.ts`, `donor-grader.ts`,
  `flagged-issues.ts`, `utils.ts`, `donor-grader.test.ts`
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store
- `src/lib/components/steps/` — ten `StepN*.svelte` components
- `src/lib/components/ui/` — Lily Svelte headless components
- `src/lib/config/` — `steps.ts`, `themes.ts`
- `src/lib/data/sample-reports.ts` — sample donors + engine-derived rows
- `src/routes/blood-donation-assessments/` — dashboard + `[id]` wizard +
  `[id]/report` + `[id]/report/pdf`
