# Anesthesiology Assessment — front-end (SvelteKit)

Consolidated SvelteKit front-end: a single continuous wizard plus an SVAR
dashboard. SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System
Svelte headless contract. Vitest for the scoring engine.

RESTful routes: `/anesthesiology-assessments/` (dashboard) and
`/anesthesiology-assessments/[id]` (wizard) + `[id]/report` + `[id]/report/pdf`.

The shared engine (`src/lib/engine/`) combines four validated instruments —
ASA Physical Status, the Mallampati / airway assessment, the Revised Cardiac
Risk Index (RCRI / Lee), and STOP-BANG — into a composite perioperative risk
level and raises safety-critical flags.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
