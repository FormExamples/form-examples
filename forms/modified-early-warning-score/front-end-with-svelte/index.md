# MEWS — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Modified Early Warning Score (MEWS): a
single continuous single-page wizard plus a clinician dashboard, styled with the
Lily Design System (Svelte headless) and powered by a pure Svelte 5 scoring
engine.

- **Wizard** — `/modified-early-warning-scores/[id]`: eight sections (context,
  patient identification, systolic blood pressure, heart rate, respiratory rate,
  temperature, consciousness/AVPU, review). Live per-parameter subscore pills and
  a running aggregate MEWS.
- **Dashboard** — `/modified-early-warning-scores`: SVAR DataGrid with the
  engine-derived aggregate MEWS, risk band, single-parameter-trigger flag, and
  monitoring frequency; filter by risk band and single-parameter trigger.
- **Report** — `/modified-early-warning-scores/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `mews-rules.ts`, `mews-grader.ts`,
`flagged-issues.ts`. Ported faithfully from the tested HTML front-end. Five
physiological parameters — systolic blood pressure, heart rate, respiratory
rate, temperature, and AVPU level of consciousness — are each allocated a
sub-score of 0-3 by the Subbe (2001) allocation table and summed to an aggregate
MEWS of 0-14. The risk band is `high` (>= 5), `medium` (2-4), or `low` (0-1);
`singleParameterTrigger` fires when any single sub-score equals 3. Both the high
band and the trigger indicate urgent medical review / critical-care outreach.
Tests in `mews-grader.test.ts`.

## Stack

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Vitest. SVAR DataGrid for the
dashboard. See [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)
for the Lily Svelte headless component contract.

## Commands

```sh
pnpm install
pnpm run check       # svelte-check: 0 errors, 0 warnings
pnpm run build       # production build
pnpm exec vitest run # engine unit tests
```
