# Blood Donation Assessment — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.
Lily Design System Svelte headless component contract; SVAR DataGrid dashboard.

Consolidated front-end: a single continuous ten-step donor questionnaire
(`/blood-donation-assessments/[id]`) plus a clinician dashboard
(`/blood-donation-assessments`). The pure scoring engine in `src/lib/engine/`
applies the JPAC Donor Selection Guidelines (DSG) to determine eligibility.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
