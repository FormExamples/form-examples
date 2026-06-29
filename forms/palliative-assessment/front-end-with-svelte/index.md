# Palliative Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Consolidated front-end for the Palliative Assessment: a single continuous
nine-step wizard, a SVAR DataGrid clinician dashboard, an on-screen report,
and a server-rendered PDF. The Edmonton Symptom Assessment System-revised
(ESAS-r) scoring engine (`src/lib/engine/`) grades both the form and the
dashboard. RESTful routes: `/palliative-assessments/` (list) and
`/palliative-assessments/[id]` (form).
