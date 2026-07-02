# eGFR Calculator — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Estimated Glomerular Filtration Rate
(eGFR) Calculator: a single continuous single-page wizard plus a clinician
dashboard, styled with the Lily Design System (Svelte headless) and powered by a
pure Svelte 5 calculation engine.

- **Wizard** — `/estimated-glomerular-filtration-rate-calculators/[id]`: four
  sections (context, patient identification, serum creatinine, summary). Live
  eGFR readout and CKD G-stage badge.
- **Dashboard** — `/estimated-glomerular-filtration-rate-calculators`: SVAR
  DataGrid with the engine-derived eGFR, CKD G-stage, and nephrology-referral
  flag; filter by care setting and stage.
- **Report** — `/estimated-glomerular-filtration-rate-calculators/[id]/report`
  with a server-generated PDF (`pdfmake`).

## Calculation engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `egfr-rules.ts`, `egfr-grader.ts`,
`flagged-issues.ts`. Formula-based CKD-EPI 2021 creatinine equation (race-free):
serum creatinine is converted µmol/L → mg/dL (÷ 88.42), then

```
eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^−1.200 × 0.9938^age × (1.012 if female)
```

with κ = 0.7 / 0.9 and α = −0.241 / −0.302 for female / male. The unrounded
eGFR is banded into a KDIGO CKD G-stage (G1 ≥ 90, G2 60–89, G3a 45–59, G3b
30–44, G4 15–29, G5 < 15). Low eGFR, non-steady-state creatinine, and
missing inputs raise flags. Tests in `egfr-grader.test.ts`.

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
