# CAM — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the CAM specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **status / classification** form — the engine emits a delirium
classification (`present` / `absent` / `unable-to-assess`) plus the positive
feature set. There is no numeric score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `cam-rules.ts`, `cam-grader.ts`, `flagged-issues.ts`) + `cam-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (8 steps: assessor, patient, feature 1-4, observations, result).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/confusion-assessment-methods/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Diagnostic algorithm (pure boolean, no total):

```
deliriumPresent = feature1 AND feature2 AND (feature3 OR feature4)
classification  = deliriumPresent ? 'present' : 'absent'
```

Edge case: for the CAM-ICU variant, an unrousable patient (RASS -4/-5) yields
`unable-to-assess` and the algorithm is not evaluated. `calculateCamGrade`
returns the classification, the positive-feature set, per-feature booleans, the
motoric subtype, the fired-rule audit trail, and the flagged issues.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- Unset features default to `absent` at evaluation but are stored distinctly so
  incomplete assessments are detectable.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
