# Nutrition Assessment — patient form (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Consolidated front-end: a single continuous wizard at
`/nutrition-assessments/[id]`, a SVAR DataGrid clinician dashboard at
`/nutrition-assessments/`, and an id-based report + PDF. The shared pure
engine in `src/lib/engine/` scores the patient with the Malnutrition Universal
Screening Tool (MUST), derives an overall severity level, and raises clinician
flags. See parent `../index.md` for the full form specification.
