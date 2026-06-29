# Workplace Safety Assessment — front end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid + Lily Design
System Svelte headless. Vitest for unit tests.

Consolidated `front-end-with-svelte/`: RESTful routes
`/workplace-safety-assessments` (dashboard) and
`/workplace-safety-assessments/[id]` (wizard), plus a welcome page and a graded
report with PDF export. The shared scoring engine in `src/lib/engine/` grades
both the form and the dashboard.

See parent [`../index.md`](../index.md) for the form specification and
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) for the
Lily Svelte headless conventions.
