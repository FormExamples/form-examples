# CHA2DS2-VASc — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the CHA2DS2-VASc specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `cha2ds2vasc-rules.ts`, `cha2ds2vasc-grader.ts`, `flagged-issues.ts`) +
  `cha2ds2vasc-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections:
  Context, Identification, CardiacHistory, MetabolicHistory, AgeCriterion,
  Summary.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard
  rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/cha2ds2-vasc-assessments/` — RESTful routes: `/<plural>/`
  (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

Eight weighted criteria summed to a total of 0–9:

- CHF / hypertension / diabetes / vascular disease → 1 each when present.
- Prior stroke / TIA / thromboembolism → 2 when present.
- Age ≥ 75 → 2; age 65–74 → 1 (mutually exclusive, never both).
- Female sex category → 1.
- Risk band edge cases: male total 0 = low, female total 1 (sex point only) =
  low, male total 1 = intermediate, otherwise high.
- `annualStrokeRatePercent` is a fixed lookup indexed by total score
  (0→0.2 … 9→15.2, Lip et al. Chest 2010).

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
