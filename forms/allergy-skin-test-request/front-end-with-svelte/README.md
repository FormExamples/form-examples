# Allergy Skin Test Request — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 (Lily Design System tokens) +
SVAR DataGrid. Vitest for unit tests.

A single continuous seven-step wizard collects the allergy testing referral and
the shared pure engine computes a four-axis grade (appropriateness, validity and
safety, request completeness, triage priority) plus safety flags and a vetting
recommendation. RESTful routes: `/allergy-skin-test-requests` (vetting
dashboard) and `/allergy-skin-test-requests/[id]` (wizard) with `[id]/report`
and `[id]/report/pdf`.
