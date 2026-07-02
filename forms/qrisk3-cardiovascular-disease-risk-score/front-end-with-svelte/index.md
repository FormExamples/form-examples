# QRISK3 — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the QRISK3 Cardiovascular Disease Risk
Score: a single continuous single-page wizard plus a clinician dashboard, styled
with the Lily Design System (Svelte headless) and powered by a pure Svelte 5
scoring engine.

> **Representative model.** The scoring engine is a documented approximation in
> the *shape* of QRISK3, not the official QRISK3-2017 Cox algorithm. It ranks
> patients the way QRISK3 would but must not be used for real clinical
> decision-making. Ported faithfully from the HTML front-end engine.

- **Wizard** — `/qrisk3-cardiovascular-disease-risk-scores/[id]`: eight sections
  (context, patient identification, eligibility, lifestyle, cardiometabolic
  measurements, comorbidity history, medication, summary). Live 10-year CVD
  risk, risk band, and heart age.
- **Dashboard** — `/qrisk3-cardiovascular-disease-risk-scores`: SVAR DataGrid
  with the engine-derived 10-year risk, risk band, heart age, and statin-offer
  flag; filter by care setting and risk band.
- **Report** — `/qrisk3-cardiovascular-disease-risk-scores/[id]/report` with a
  server-generated PDF (`pdfmake`), including the weighted-contribution audit.

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `qrisk3-coefficients.ts`,
`qrisk3-grader.ts`, `flagged-issues.ts`. Weighted (not additive): each input is
centred on a cohort mean and multiplied by a fitted log-hazard-ratio-style
weight; the contributions sum to a linear predictor `LP`, then
`tenYearRiskPercent = 100 × (1 − S0^exp(LP))` using the sex-specific baseline
survival `S0`. Bands at `>= 10` (`raised`, NICE statin threshold) and `>= 20`
(`high`). Heart age inverts the risk function. Tests in `qrisk3-grader.test.ts`.

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
