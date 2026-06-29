# Employee Offboarding Checklist — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Single-page offboarding checklist wizard plus an SVAR DataGrid HR dashboard, on
RESTful routes `/employee-offboarding-checklists/` (list) and
`/employee-offboarding-checklists/[id]` (form). The shared Offboarding
Completeness Validation engine returns a Complete / Partial / Incomplete outcome
with a completion percentage, blocking items, and priority flags. See
[`index.md`](index.md) for details.
