# SOFA — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the SOFA specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `sofa-rules.ts`, `sofa-grader.ts`, `flagged-issues.ts`) + `sofa-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/sequential-organ-failure-assessments/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

- **Input:** `AssessmentData` — context and baseline plus six organ-system
  sub-groups (respiration, coagulation, liver, cardiovascular, cns, renal).
- **Output:** `GradingResult` — `subScores` (six 0-4 or null), `totalSofa`
  (0-24), `complete`, `deltaSofa`, `mortalityBand`, `sepsis3`, `firedRules`,
  `flaggedIssues`.
- **Algorithm:** map each system's input(s) to a 0-4 sub-score via the published
  thresholds (cardiovascular and renal take the max of two criteria; respiration
  3-4 require respiratory support); sum to a total; derive delta-SOFA from the
  baseline; band the total for mortality; set Sepsis-3 when infection is
  suspected and delta-SOFA &ge; 2. A missing input yields a `null` sub-score and
  an incomplete-assessment flag — never guess.
- **Entry point:** `calculateSofaGrade(data)` in `sofa-grader.ts`.

## Flagged issues

Computed independently of the total (spec §7): severe single-organ failure (any
sub-score 4, high), multi-organ failure (two or more systems &ge; 3, high),
rising SOFA (delta &ge; 2, high), marked deterioration (delta &ge; 4, high),
high mortality risk (total &ge; 12, high), improving trajectory (delta &le; -2,
low), incomplete assessment (any sub-score null, medium).

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Step components named `StepNName.svelte` (1-indexed).
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Engine tests define their own local `createDefaultAssessment` fixture and
  never import the store (which pulls in the SvelteKit-only `$app/environment`).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
