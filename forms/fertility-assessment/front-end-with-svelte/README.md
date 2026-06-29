# Fertility Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte
headless. SVAR DataGrid dashboard. Vitest for the grading engine.

This is the consolidated front-end: a single continuous wizard plus a
clinician dashboard, served from RESTful routes.

## Routes

- `/` — welcome page (purpose, spec, links to form and dashboard).
- `/fertility-assessments` — clinician dashboard (SVAR DataGrid; client-only).
- `/fertility-assessments/new` — new assessment wizard.
- `/fertility-assessments/[id]` — edit a seeded sample assessment.
- `/fertility-assessments/[id]/report` — graded report view.
- `/fertility-assessments/[id]/report/pdf` — server-rendered PDF (pdfmake).

## Scoring

NICE CG156 fertility (sub-fertility) triage. The shared engine
(`src/lib/engine/`) fires weighted rules over reproductive, menstrual,
ovarian-reserve, lifestyle, and WHO 2021 semen-analysis factors, sums the
weights into a concern score, and classifies it as Low / Moderate / High
concern. A separate flag detector raises clinician-facing issues.

See the parent [`../index.md`](../index.md) for the full form specification.
