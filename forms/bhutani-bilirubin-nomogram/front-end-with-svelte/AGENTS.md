# Bhutani Bilirubin Nomogram — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Bhutani specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `bhutani-rules.ts`, `bhutani-grader.ts`, `flagged-issues.ts`) +
  `bhutani-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/bhutani-bilirubin-nomograms/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Classification engine

Classification, not additive scoring. Two independent lookups against the
tabulated curves in `bhutani-rules.ts`: (a) the 40th/75th/95th Bhutani
percentile TSB tracks interpolated at `ageHours` band the measured TSB into a
risk zone; (b) the gestation-specific NICE phototherapy and exchange-transfusion
curves interpolated at `ageHours` set `abovePhototherapy` / `aboveExchange`.
`ageHours` is clamped to the 0–168 h domain (no extrapolation); missing inputs
yield a `null` zone and a data-completeness flag.

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
