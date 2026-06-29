# Integumentary Assessment — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4, styled with the Lily Design
System token vocabulary. Vitest for unit tests; SVAR DataGrid for the dashboard.

Consolidated front-end: a single continuous nine-step wizard plus a
tissue-viability dashboard, served from RESTful routes:

- `/` — welcome page
- `/integumentary-assessments` — dashboard (SVAR DataGrid; client-only)
- `/integumentary-assessments/[id]` — assessment wizard (`new` or a sample id)
- `/integumentary-assessments/[id]/report` — graded report
- `/integumentary-assessments/[id]/report/pdf` — server-rendered PDF

The shared engine grades pressure-ulcer risk with the Braden Scale (total
6-23, lower = higher risk) and raises flagged issues for skin, wound, hair,
nail, and documentation findings. See parent [`../index.md`](../index.md) for
the full domain specification.
