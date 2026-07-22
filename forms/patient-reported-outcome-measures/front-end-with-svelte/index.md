# Patient-Reported Outcome Measures — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the PRO-measures battery (SF-36v2, NDI,
mJOA, EQ-5D-3L): a single continuous single-page wizard plus a clinician
dashboard, styled with the Lily Design System (Svelte headless) and powered
by a pure Svelte 5 scoring engine ported directly from the verified
vanilla-JS engine in `../front-end-with-html/js/`.

- **Wizard** — `/patient-reported-outcome-measure-visits/[id]`: 9 steps
  (visit details, SF-36v2 across 4 steps, NDI, mJOA, EQ-5D-3L, and a
  summary of all four independently-scored instruments).
- **Dashboard** — `/patient-reported-outcome-measure-visits`: SVAR DataGrid
  with the engine-derived SF-36 approximate summaries, NDI band, mJOA band,
  and EQ-5D index; filter by visit and NDI band.
- **Report** — `/patient-reported-outcome-measure-visits/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `sf36-rules.ts`, `ndi-rules.ts`,
`mjoa-rules.ts`, `eq5d-rules.ts`, `composite.ts`, `factory.ts`. Each of the
four instruments is scored independently — there is no cross-instrument
composite:

- **SF-36v2** — 8 domain scores (0-100, higher = better) via the
  public-domain RAND-36 recode-then-average method, plus simplified,
  non-licensed `pcsApprox`/`mcsApprox` summaries.
- **NDI** — percentage (0-100%, lower = better), missing-section-adjusted.
- **mJOA** — total 0-17 (higher = better), null unless all 6 subscales
  answered.
- **EQ-5D-3L** — 5-digit health-state descriptor + Dolan (1997) UK TTO
  index value, plus a directly-recorded 0-100 VAS.

Tests: `sf36-rules.test.ts`, `ndi-rules.test.ts`, `mjoa-rules.test.ts`,
`eq5d-rules.test.ts`.

## Stack

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Vitest. SVAR DataGrid for
the dashboard. See
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) for
the Lily Svelte headless component contract.

## Commands

```sh
pnpm install
pnpm run check       # svelte-check: 0 errors
pnpm run build       # production build
pnpm exec vitest run # engine unit tests
```
