# Corrected Calcium Calculator — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Corrected Calcium Calculator: a single
continuous single-page wizard plus a clinician dashboard, styled with the Lily
Design System (Svelte headless) and powered by a pure Svelte 5 calculation
engine.

- **Wizard** — `/corrected-calcium-calculators/[id]`: six sections (context,
  patient identification, total calcium, serum albumin, symptoms, summary). Live
  corrected-calcium readout and classification badge.
- **Dashboard** — `/corrected-calcium-calculators`: SVAR DataGrid with the
  engine-derived corrected calcium, classification, and severe flag; filter by
  care setting and classification.
- **Report** — `/corrected-calcium-calculators/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Calculation engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `calcium-rules.ts`,
`calcium-calculator.ts`, `flagged-issues.ts`. Formula-based:
`correctedCalcium = totalCalcium + 0.02 × (40 − albumin)`, computed when both
inputs are present, then classified against the adult reference range 2.20-2.60
mmol/L (hypocalcaemia / normal / hypercalcaemia). Severe results (≥ 3.0 or < 1.9
mmol/L) are flagged. Tests in `calcium-calculator.test.ts`.

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
