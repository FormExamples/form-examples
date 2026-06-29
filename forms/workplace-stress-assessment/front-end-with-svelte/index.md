# Workplace Stress Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid. Vitest for the
grading engine.

An anonymous employee survey using the UK HSE Management Standards Indicator
Tool (35 items, 1-5 Likert) across seven organisational domains: demands,
control, manager support, peer support, relationships, role clarity, and
organisational change. The shared pure engine reverse-codes negatively-worded
items, computes a per-domain mean, benchmarks each against HSE percentile norms
(Low / Moderate / High / Very High concern), takes the worst domain as the
overall concern level, and raises flagged issues.

## Routes

- `/` — welcome page
- `/workplace-stress-assessments` — occupational-health dashboard (SVAR DataGrid)
- `/workplace-stress-assessments/[id]` — single-page wizard (9 steps)
- `/workplace-stress-assessments/[id]/report` — id-based report
- `/workplace-stress-assessments/[id]/report/pdf` — server-rendered PDF

See parent [`../index.md`](../index.md) for the full form specification.
