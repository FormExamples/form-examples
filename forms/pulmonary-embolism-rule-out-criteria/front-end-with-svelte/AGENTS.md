# PERC — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the PERC specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **status / classification** form — the engine emits a PERC
classification (`perc-negative` / `perc-positive`) from a boolean conjunction of
the eight criteria and the pre-test-probability gate. There is no numeric score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `perc-rules.ts`, `perc-grader.ts`, `flagged-issues.ts`) + `perc-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (6 steps: context, patient, pre-test, vitals, criteria, result).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/pulmonary-embolism-rule-out-criterias/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Classification algorithm (pure boolean, no total):

```
allCriteriaSatisfied = c1 AND c2 AND ... AND c8
applicable           = pretestProbability === 'low'
classification       = (applicable AND allCriteriaSatisfied)
                         ? 'perc-negative'   // PE excluded, no D-dimer/imaging
                         : 'perc-positive';  // proceed to D-dimer / imaging
```

Criteria 1-3 derive from objective numeric values (age < 50, heart rate < 100,
SpO2 >= 95); criteria 4-8 are yes/no findings, satisfied only in the reassuring
'no' state. A missing input is treated as **failed**. One failure is decisive.
`calculatePercGrade` returns the classification, `allCriteriaSatisfied`,
`applicable`, the per-criterion results, the failed-criteria set, the fired-rule
audit trail, and the flagged issues.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- A missing numeric or unset yes/no criterion is failed, but stored distinctly so
  incomplete assessments are detectable (`hasMissingInputs`).
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
