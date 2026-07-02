# Child-Pugh Score — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Child-Pugh Score (Child-Turcotte-Pugh):
a single continuous single-page wizard plus a clinician dashboard, styled with
the Lily Design System (Svelte headless) and powered by a pure Svelte 5 scoring
engine.

- **Wizard** — `/child-pugh-scores/[id]`: eight sections (context, patient
  identification, total bilirubin, serum albumin, coagulation, ascites, hepatic
  encephalopathy, summary). Live per-parameter points and a live score / class
  readout.
- **Dashboard** — `/child-pugh-scores`: SVAR DataGrid with the engine-derived
  Child-Pugh score, class, surgical risk, and flag count; filter by care setting
  and class.
- **Report** — `/child-pugh-scores/[id]/report` with a server-generated PDF
  (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `child-pugh-rules.ts`,
`child-pugh-grader.ts`, `flagged-issues.ts`. Additive class-band score: five
parameters, each 1-3 points against fixed thresholds (bilirubin 34/50 µmol/L,
albumin 28/35 g/L, INR 1.7/2.3 with a prothrombin-time-prolongation fallback,
ascites, encephalopathy), summed to 5-15 and banded into Class A (5-6), B (7-9),
or C (10-15). Each class fixes one- and two-year survival and peri-operative
surgical risk. Missing parameters yield a partial total and a completeness flag.
Tests in `child-pugh-grader.test.ts`.

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
