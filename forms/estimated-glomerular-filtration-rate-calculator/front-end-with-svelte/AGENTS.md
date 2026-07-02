# eGFR Calculator — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the eGFR specification and calculation engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure calculation engine (`types.ts`, `utils.ts`,
  `egfr-rules.ts`, `egfr-grader.ts`, `flagged-issues.ts`) +
  `egfr-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/estimated-glomerular-filtration-rate-calculators/` — RESTful
  routes: `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Calculation engine

Formula-based (not additive): the CKD-EPI 2021 creatinine equation (race-free)
computed only when serum creatinine, age, and sex are all present, then banded
into a KDIGO CKD G-stage (G1–G5). The unrounded eGFR drives banding and every
flag threshold; the rounded value is display-only. Low eGFR (drug-dosing review,
nephrology referral for G4/G5), a non-steady-state creatinine (possible AKI),
and missing inputs raise flags.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
