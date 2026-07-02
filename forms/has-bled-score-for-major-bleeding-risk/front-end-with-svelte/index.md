# HAS-BLED — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the HAS-BLED Score for Major Bleeding Risk:
a single continuous single-page wizard plus a clinician dashboard, styled with
the Lily Design System (Svelte headless) and powered by a pure Svelte 5 scoring
engine.

- **Wizard** — `/has-bled-score-for-major-bleeding-risks/[id]`: nine sections
  (context, patient identification, hypertension, renal and liver function,
  stroke, bleeding, labile INR, drugs and alcohol, summary). Live per-criterion
  point pills and running HAS-BLED score.
- **Dashboard** — `/has-bled-score-for-major-bleeding-risks`: SVAR DataGrid with
  the engine-derived HAS-BLED score, risk band, and high-bleeding-risk flag;
  filter by care setting and risk band.
- **Report** — `/has-bled-score-for-major-bleeding-risks/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `hasbled-rules.ts`,
`hasbled-grader.ts`, `flagged-issues.ts`. Additive: nine criteria (H, A×2, S, B,
L, E, D×2), each 1 point; total 0-9; risk band low (0), moderate (1-2), high
(≥ 3). Elderly and alcohol points derive from numeric inputs. Tests in
`hasbled-grader.test.ts` cover the age boundary (65/66), the alcohol boundary
(7/8 units), the risk-band boundaries, and the minimum and maximum totals.

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
