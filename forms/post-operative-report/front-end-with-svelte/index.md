# Post-Operative Report — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4, styled with the Lily Design
System token utilities. Vitest for the grading-engine unit tests.

A single continuous wizard captures the structured operation note and grades
complications with the Clavien-Dindo classification of surgical complications
(Grade 0 through Grade V). RESTful routes: `/post-operative-reports/` (SVAR
dashboard) and `/post-operative-reports/[id]` (wizard) → `[id]/report` →
`[id]/report/pdf`.

See parent [`../index.md`](../index.md) for the full form specification.
