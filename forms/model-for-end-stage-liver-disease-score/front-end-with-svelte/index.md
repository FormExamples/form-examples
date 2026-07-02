# MELD Score — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Model for End-Stage Liver Disease
(MELD) Score: a single continuous single-page wizard plus a clinician
dashboard, styled with the Lily Design System (Svelte headless) and powered by a
pure Svelte 5 calculation engine.

- **Wizard** — `/model-for-end-stage-liver-disease-scores/[id]`: eight sections
  (context with MELD instrument, patient identification, total bilirubin, INR,
  creatinine and dialysis, serum sodium, serum albumin, summary). The sodium and
  albumin sections appear only for the instruments that need them (MELD-Na and
  MELD 3.0). Live MELD readout and mortality-band badge.
- **Dashboard** — `/model-for-end-stage-liver-disease-scores`: SVAR DataGrid
  with the engine-derived MELD score, mortality band, and dialysis flag; filter
  by care setting and mortality band.
- **Report** — `/model-for-end-stage-liver-disease-scores/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Calculation engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `meld-rules.ts`, `meld-grader.ts`,
`flagged-issues.ts`. A weighted logarithmic formula (not additive):

```
meld = round(3.78·ln(bilirubin) + 11.2·ln(INR) + 9.57·ln(creatinine) + 6.43)
```

with unit conversion (umol/L → mg/dL), the dialysis creatinine rule (≥ 2
haemodialysis sessions or ≥ 24 h CVVHD → creatinine 4.0 mg/dL), value bounds
(floor 1.0; creatinine cap 4.0), the MELD-Na sodium correction (sodium clamped
125-137, applied when the base MELD > 11), the MELD 3.0 variant (sex + albumin,
creatinine cap 3.0), a final clamp to 6-40, and a mapping to an estimated
3-month mortality band. Tests in `meld-grader.test.ts`.

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
