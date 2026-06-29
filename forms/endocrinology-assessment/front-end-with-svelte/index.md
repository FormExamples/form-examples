# Endocrinology Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System (Svelte
headless) + SVAR DataGrid. Vitest for the grading engine.

Consolidated gold front-end: a single-page, step-by-step wizard plus a
clinician dashboard, served from RESTful routes:

- `/` — welcome page
- `/endocrinology-assessments` — clinician dashboard (SVAR DataGrid)
- `/endocrinology-assessments/new` — new assessment wizard
- `/endocrinology-assessments/[id]` — edit an assessment (seeded from samples)
- `/endocrinology-assessments/[id]/report` — graded report
- `/endocrinology-assessments/[id]/report/pdf` — server-rendered PDF

The shared pure engine (`src/lib/engine/`) grades each endocrine axis
(thyroid, adrenal, glucose, reproductive, pituitary, bone & calcium) as
normal / subclinical / mild / moderate / severe, derives an overall endocrine
status as the most severe axis, and raises urgent / high / medium / low flags.

See parent [`../index.md`](../index.md) for the full domain specification.
