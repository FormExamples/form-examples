# Employee Offboarding Checklist — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

A single continuous wizard captures the ten offboarding sections (employee
details, exit interview, knowledge transfer, equipment return, access
revocation, final payroll and benefits, references and recommendations,
non-disclosure and post-employment, forwarding details, sign-off). The shared
Offboarding Completeness Validation engine returns a Complete / Partial /
Incomplete outcome with a completion percentage, a list of blocking items, and
priority flags for HR. An SVAR DataGrid dashboard lists departing employees
with their engine-derived outcome.

## Routes

- `/` — welcome page
- `/employee-offboarding-checklists` — HR dashboard (SVAR DataGrid; client-only)
- `/employee-offboarding-checklists/[id]` — checklist wizard
- `/employee-offboarding-checklists/[id]/report` — completeness report
- `/employee-offboarding-checklists/[id]/report/pdf` — PDF endpoint
