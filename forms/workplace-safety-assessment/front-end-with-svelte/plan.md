# Plan: Workplace Safety Assessment — front end (SvelteKit)

## Current status

Complete. Consolidated gold-standard `front-end-with-svelte/`:

- Scoring engine in `src/lib/engine/` (rules, grader, flagged issues, utils) with Vitest tests.
- Id-keyed reactive store with localStorage persistence and in-place deep-merge hydration.
- Ten `StepN*.svelte` wizard sections (single continuous single-page wizard).
- RESTful routes: `/workplace-safety-assessments` (SVAR dashboard, `ssr = false`) and `/workplace-safety-assessments/[id]` (wizard) + `[id]/report` + `[id]/report/pdf`.
- Welcome page, themed layout (45 Lily themes + ThemeSelect), graded report, PDF export.
- Sample audits + engine-derived dashboard rows spanning the outcome range.

## Verify

- `pnpm run check` — 0 errors, 0 warnings
- `pnpm run build` — succeeds
- `pnpm exec vitest run` — engine tests pass
