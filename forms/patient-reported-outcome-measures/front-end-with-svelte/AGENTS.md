# Patient-Reported Outcome Measures — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the PRO-measures specification, and [`../spec/index.md`](../spec/index.md)
for the authoritative item catalogue and scoring algorithms. Lily Svelte
headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine, a direct TypeScript port of
  `../front-end-with-html/js/` (`types.ts`, `sf36-rules.ts`, `ndi-rules.ts`,
  `mjoa-rules.ts`, `eq5d-rules.ts`, `composite.ts`, `factory.ts`) + one
  `*.test.ts` per instrument.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections,
  plus the shared `ScaleItemField.svelte` per-item radio-group renderer.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `scales.ts` (SF-36 response-scale labels),
  `themes.ts`, `locales.ts`, `text-sizes.ts`.
- `src/lib/data/sample-reports.ts` — sample visits + engine-derived dashboard
  rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/patient-reported-outcome-measures/patient-reported-outcome-measure-visits/`
  — RESTful routes: `/<plural>/` (dashboard, `ssr = false`) +
  `/<plural>/[id]` (9-step wizard) + `/<plural>/[id]/report`
  (+ `report/pdf` server endpoint).

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript — must match
  `../front-end-with-html/js/types.js` field names exactly.
- The scoring engine is ported item-for-item, coefficient-for-coefficient
  from the already-verified vanilla-JS engine — never re-derive the
  algorithms independently.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
