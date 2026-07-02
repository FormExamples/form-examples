# NEWS2 — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the National Early Warning Score 2
(NEWS2): a single continuous single-page wizard plus a clinician dashboard,
styled with the Lily Design System (Svelte headless) and powered by a pure
Svelte 5 scoring engine.

- **Wizard** — `/national-early-warning-score-2s/[id]`: ten sections (context,
  patient identification, respiration rate, oxygen saturation, air or oxygen,
  systolic blood pressure, pulse, consciousness/ACVPU, temperature, review).
  Live per-parameter subscore pills and running aggregate NEWS2 total.
- **Dashboard** — `/national-early-warning-score-2s`: SVAR DataGrid with the
  engine-derived aggregate, risk band, red-score flag, and monitoring frequency;
  filter by risk band and red score.
- **Report** — `/national-early-warning-score-2s/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `news2-rules.ts`, `news2-grader.ts`,
`flagged-issues.ts`. Ported faithfully from the tested HTML front-end. Six
physiological parameters scored 0-3 (SpO2 uses the Scale 1 / Scale 2 tables,
Scale 2 also depending on air vs oxygen) plus a supplemental-oxygen +2 weighting
sum to an aggregate 0-20+. The red-score rule (any single parameter = 3)
escalates to at least the low-medium band; the risk band is the worst of the
aggregate band (0 / 1-4 / 5-6 / >=7) and the red-score band, and drives the
RCP-recommended monitoring frequency and clinical response. Tests in
`news2-grader.test.ts`.

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
