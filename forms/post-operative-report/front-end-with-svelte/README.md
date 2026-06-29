# Post-Operative Report — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4, styled with the Lily Design
System token utilities. Vitest for the grading-engine unit tests.

A single continuous wizard captures the operation note (patient, procedure,
team, intra-operative findings, anaesthesia, blood loss and fluids, specimens
and implants, immediate post-op status, complications, and onward plan). The
shared pure engine grades complications with the Clavien-Dindo classification
and surfaces an overall (worst) grade plus safety flags. RESTful routes:
`/post-operative-reports/` (SVAR dashboard) and
`/post-operative-reports/[id]` (wizard) → `[id]/report` → `[id]/report/pdf`.

See parent [`../index.md`](../index.md) for the full form specification.
