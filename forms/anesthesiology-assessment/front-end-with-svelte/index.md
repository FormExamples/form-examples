# Anesthesiology Assessment — front-end (SvelteKit)

Consolidated SvelteKit front-end for the UK NHS-aligned pre-operative
anaesthesiology assessment: a single continuous ten-step wizard plus an SVAR
anaesthetist dashboard. SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily
Design System Svelte headless contract. Vitest for the scoring engine.

The shared engine combines four validated instruments — ASA Physical Status,
the Mallampati / airway assessment, the Revised Cardiac Risk Index (RCRI /
Lee), and STOP-BANG (OSA screening) — into a composite perioperative risk
level (Low / Moderate / High / Critical) and raises safety-critical flags.

## Routes

- `/` — welcome page
- `/anesthesiology-assessments` — anaesthetist dashboard (SVAR DataGrid)
- `/anesthesiology-assessments/[id]` — assessment wizard
- `/anesthesiology-assessments/[id]/report` — graded report
- `/anesthesiology-assessments/[id]/report/pdf` — PDF endpoint

## Commands

```sh
pnpm install
pnpm run check        # svelte-check (0 errors, 0 warnings)
pnpm run build        # production build
pnpm exec vitest run  # engine unit tests
```
