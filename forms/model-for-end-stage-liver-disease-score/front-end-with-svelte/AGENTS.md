# MELD Score — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the MELD specification and calculation engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure calculation engine (`types.ts`, `utils.ts`,
  `meld-rules.ts`, `meld-grader.ts`, `flagged-issues.ts`) +
  `meld-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts` (conditional sodium/albumin visibility),
  `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/model-for-end-stage-liver-disease-scores/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Calculation engine

Weighted logarithmic (not additive):
`meld = round(3.78·ln(bilirubin) + 11.2·ln(INR) + 9.57·ln(creatinine) + 6.43)`,
with unit conversion, the dialysis creatinine rule (≥ 2 sessions or CVVHD →
creatinine 4.0), value bounds (floor 1.0; cap 4.0), the MELD-Na sodium correction
(clamp 125-137, applied when base MELD > 11), the MELD 3.0 variant (sex +
albumin, creatinine cap 3.0), a final clamp to 6-40, and a mortality-band mapping.
A missing input required by the chosen variant leaves the score null and raises
an incomplete-assessment flag.

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
