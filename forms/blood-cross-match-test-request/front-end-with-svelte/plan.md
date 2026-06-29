# Plan: Blood Cross-Match Test Request — consolidated front-end (SvelteKit)

## Current status

Complete. Consolidated gold-standard `front-end-with-svelte/`: seven-step
clinician wizard, four-axis grading engine, vetting report + PDF, and an SVAR
DataGrid vetting dashboard.

## Structure

- `src/lib/engine/` — pure four-axis engine (`types.ts`, `defaults.ts`,
  `rules.ts`, `flags.ts`, `grader.ts`, `utils.ts`) ported from the HTML
  front-end's JS source of truth, with `grader.test.ts` (Vitest).
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store with
  in-place `deepAssign` deep-merge and localStorage persistence.
- `src/lib/components/steps/` — the seven `StepN*.svelte` sections.
- `src/lib/data/sample-reports.ts` — four engine-derived sample requests + rows.
- `src/routes/blood-cross-match-test-requests/` — RESTful list + `[id]` wizard +
  report + PDF endpoint.
