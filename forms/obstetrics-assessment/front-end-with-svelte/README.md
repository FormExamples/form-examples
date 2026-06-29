# Obstetrics Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

A single continuous wizard for the NICE NG201 antenatal risk assessment plus a
maternity-team dashboard (SVAR DataGrid). The shared engine stratifies each
pregnancy into low, moderate, or high risk and flags issues for the care team.

- `/obstetrics-assessments/` — dashboard (risk level, care pathway, flags)
- `/obstetrics-assessments/[id]` — assessment wizard
- `/obstetrics-assessments/[id]/report` — graded report (+ PDF endpoint)
