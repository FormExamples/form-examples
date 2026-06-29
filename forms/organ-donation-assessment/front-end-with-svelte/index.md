# Organ Donation Assessment — front end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid. Vitest for the
grading engine. Lily Design System Svelte headless component contract.

Consolidated front end: a single continuous wizard plus a clinician dashboard.

- `/` — welcome page (purpose, spec, links to the form and the dashboard).
- `/organ-donation-assessments` — clinician dashboard (SVAR DataGrid).
- `/organ-donation-assessments/new` — start a new assessment.
- `/organ-donation-assessments/[id]` — edit / fill the assessment wizard.
- `/organ-donation-assessments/[id]/report` — graded report (+ PDF download).

The shared engine (`src/lib/engine/`) classifies donor eligibility (suitable,
conditionally suitable, unsuitable) and an overall risk level (low, moderate,
high, critical) from the Donor Risk Index and organ-specific suitability rules,
and raises flagged issues for the donor assessment team. The same engine grades
both the wizard report and the dashboard rows.

See parent [`../index.md`](../index.md) for the form specification.
