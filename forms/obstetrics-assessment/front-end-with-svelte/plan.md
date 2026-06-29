# Plan: Obstetrics Assessment — consolidated front-end (SvelteKit)

## Current status

Built. Single-page NG201 antenatal wizard, maternity-team SVAR dashboard,
graded report, and PDF export. Pure scoring engine with Vitest tests.

## Structure

- `src/lib/engine/` — NG201 grading engine (types, rules, grader, flagged issues, utils) + tests
- `src/lib/components/steps/` — ten step components (StepNName.svelte)
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows
- `src/routes/obstetrics-assessments/` — dashboard, wizard, report, PDF
