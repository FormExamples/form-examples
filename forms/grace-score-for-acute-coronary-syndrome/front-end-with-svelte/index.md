# GRACE ACS — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the GRACE Score for Acute Coronary
Syndrome: a single continuous single-page wizard plus a clinician dashboard,
styled with the Lily Design System (Svelte headless) and powered by a pure
Svelte 5 scoring engine.

- **Wizard** — `/grace-scores-for-acute-coronary-syndrome/[id]`: seven sections
  (context, patient identification, haemodynamics, renal function, heart-failure
  severity, high-risk features, summary). Live per-variable point read-outs and
  a running GRACE total with risk category.
- **Dashboard** — `/grace-scores-for-acute-coronary-syndrome`: SVAR DataGrid with
  the engine-derived GRACE points, risk category, and escalation flag; filter by
  care setting and risk category.
- **Report** — `/grace-scores-for-acute-coronary-syndrome/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `grace-rules.ts`, `grace-grader.ts`,
`flagged-issues.ts`. The GRACE weighted regression point model — each of the
eight admission variables (age, heart rate, systolic BP, serum creatinine,
Killip class, cardiac arrest, ST-segment deviation, elevated enzymes) maps
through a weighted, banded lookup; the points are summed into a total, read
against the in-hospital (&le; 108 / 109&ndash;140 / &gt; 140) and 6-month
(&le; 88 / 89&ndash;118 / &gt; 118) mortality bands, with the overall risk
category the worse of the two (max-band rule). Serum creatinine is normalised to
mg/dL (µmol/L &divide; 88.4) before banding. Tests in `grace-grader.test.ts`.

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
