# Blood Donation Assessment — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4, Lily Design System Svelte
headless component contract, SVAR DataGrid dashboard. Vitest for unit tests.

Consolidated front-end: a single continuous ten-step donor questionnaire plus
a clinician dashboard. The shared pure scoring engine applies the JPAC Donor
Selection Guidelines (DSG) used by UK NHSBT to determine donor eligibility
(eligible / temporarily deferred / permanently deferred), the deferral window,
and clinician-facing flagged issues.

## Routes

- `/` — welcome page (purpose, spec, docs, links to form and dashboard)
- `/blood-donation-assessments` — SVAR DataGrid clinician dashboard
- `/blood-donation-assessments/new` — new donor questionnaire (wizard)
- `/blood-donation-assessments/[id]` — edit a donor questionnaire
- `/blood-donation-assessments/[id]/report` — eligibility report
- `/blood-donation-assessments/[id]/report/pdf` — PDF report endpoint

See parent [`../index.md`](../index.md) for the form specification.
