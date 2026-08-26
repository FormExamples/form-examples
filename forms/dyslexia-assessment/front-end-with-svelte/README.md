# Dyslexia Assessment — patient form (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte headless. Vitest for unit tests.

Consolidated front-end: a single-page wizard at `/dyslexia-assessments/[id]` and a SVAR DataGrid clinician dashboard at `/dyslexia-assessments`. The shared scoring engine in `src/lib/engine/` classifies each standardized score (mean 100, SD 15) into a severity band and derives the overall severity from the most-impaired domain.

See parent [`../index.md`](../index.md) for the full form specification (steps, scoring, conventions).
