# Fall Risk Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4, styled with the Lily Design
System Svelte headless contract. Vitest for unit tests.

This is the consolidated gold front-end: a single continuous wizard plus an
SVAR DataGrid clinician dashboard.

## Routes

- `/` — welcome page (purpose, spec, links to the form and dashboard)
- `/fall-risk-assessments` — clinician dashboard (SVAR DataGrid; `ssr = false`)
- `/fall-risk-assessments/new` — new assessment wizard
- `/fall-risk-assessments/[id]` — edit an existing (seeded) assessment
- `/fall-risk-assessments/[id]/report` — graded report
- `/fall-risk-assessments/[id]/report/pdf` — server-rendered PDF (pdfmake)

## Scoring

Six-item Morse Fall Scale (MFS), total 0-125: Low (0-24), Moderate (25-44),
High (≥45), escalated to Critical for recurrent falls with injury, an
anticoagulated patient, or MFS ≥ 75. The pure engine lives in
`src/lib/engine/` (`types.ts`, `mfs-rules.ts`, `fall-risk-grader.ts`,
`flagged-issues.ts`, `utils.ts`) with tests in `fall-risk-grader.test.ts`.

See parent [`../index.md`](../index.md) for the full form specification.
