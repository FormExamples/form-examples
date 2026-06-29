# Biopsy Test Request — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte
headless, with an SVAR DataGrid vetting dashboard and a pure four-axis grading
engine. Vitest covers the engine.

This consolidated front-end provides:

- A single continuous **wizard** at `/biopsy-test-requests/[id]` (eight sections:
  requesting clinician, patient, requested procedure, indication & question,
  lesion, bleeding & coagulation, live risk review, triage & submit).
- A **vetting dashboard** at `/biopsy-test-requests/` (SVAR DataGrid; client-only).
- An id-based **report** at `/biopsy-test-requests/[id]/report` with a
  server-rendered **PDF** at `/biopsy-test-requests/[id]/report/pdf`.

The shared engine grades each request on four orthogonal axes — appropriateness
(ACR 1–9 + band), periprocedural bleeding risk (low / moderate / high +
anticoagulant action), request completeness (0–100%), and urgency /
cancer-pathway triage (routine / urgent / two-week-wait / emergency) — plus
safety flags and an overall vetting recommendation.

See the parent [`../index.md`](../index.md) for the full clinical specification.
