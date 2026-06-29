# Plan: Employee Offboarding Checklist — consolidated front-end (SvelteKit)

## Current status

Implemented. Consolidated `front-end-with-svelte/` with a single-page checklist
wizard, an SVAR DataGrid HR dashboard, an id-based completeness report, and a
PDF endpoint.

## Structure

- `src/lib/engine/` — `types.ts`, `validation-rules.ts`, `checklist-validator.ts`,
  `flagged-issues.ts`, `utils.ts`, and `checklist-validator.test.ts` (Vitest).
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store with
  localStorage persistence and in-place deep-merge.
- `src/lib/components/steps/` — ten `StepN*.svelte` section components.
- `src/lib/data/sample-reports.ts` — sample checklists + engine-derived rows.
- `src/routes/employee-offboarding-checklists/` — dashboard, wizard, report, PDF.
