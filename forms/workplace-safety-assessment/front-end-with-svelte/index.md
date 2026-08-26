# Workplace Safety Assessment — front end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid + Lily Design
System Svelte headless. Vitest for unit tests.

Consolidated front end for the Workplace Safety Assessment: a single continuous
single-page wizard that captures a UK HSE-aligned workplace safety audit for
healthcare settings across ten sections, grades each checklist item Yes / No /
N/A with the shared scoring engine, derives an overall audit outcome
(Compliant / Minor / Major / Critical Findings), and renders a report with a
findings-by-category breakdown, non-compliant findings, and prioritized flagged
issues.

## Routes

- `/` — welcome page (purpose, spec, links to the form and dashboard)
- `/workplace-safety-assessments` — safety dashboard (SVAR DataGrid, engine-derived rows)
- `/workplace-safety-assessments/new` — start a new audit (wizard)
- `/workplace-safety-assessments/[id]` — edit an audit (wizard, seeded from sample records)
- `/workplace-safety-assessments/[id]/report` — graded audit report
- `/workplace-safety-assessments/[id]/report/pdf` — server-rendered PDF (pdfmake)

## Structure

- `src/lib/engine/` — `types.ts`, `safety-rules.ts`, `safety-grader.ts`, `flagged-issues.ts`, `utils.ts` (+ Vitest tests)
- `src/lib/stores/assessment.svelte.ts` — id-keyed reactive store with localStorage persistence
- `src/lib/components/steps/` — the ten `StepN*.svelte` wizard sections
- `src/lib/components/ui/` — Lily headless UI components
- `src/lib/data/sample-reports.ts` — sample audits + engine-derived dashboard rows
- `src/lib/report/pdf-builder.ts` — pdfmake document definition

See parent [`../index.md`](../index.md) for the form specification.
