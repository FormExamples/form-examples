# Workplace Climate Assessment — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid. Vitest for unit
tests.

Consolidated gold front-end: an anonymous single-page questionnaire wizard plus
a leadership dashboard, sharing one pure scoring engine.

- Questionnaire wizard: `/workplace-climate-assessments/[id]`
- Report: `/workplace-climate-assessments/[id]/report` (+ `/report/pdf`)
- Leadership dashboard (SVAR DataGrid): `/workplace-climate-assessments`
- Welcome page: `/`

The engine (`src/lib/engine/`) grades 1-5 Likert items across eight domains,
normalizes each domain to 0-100 (mean × 20), averages them into a composite
Workplace Climate Index, bands it Thriving / Healthy / Developing / Strained /
Critical, and raises flagged issues for HR and leadership.

See parent [`../index.md`](../index.md) for the full form specification.
