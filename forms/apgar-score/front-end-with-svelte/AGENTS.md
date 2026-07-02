# Apgar Score — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Apgar Score specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `apgar-rules.ts`, `apgar-grader.ts`, `flagged-issues.ts`) + `apgar-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`,
  `createTimepoint()`, and `addTimepoint` / `removeTimepoint` for the repeated
  per-timepoint scores.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections,
  including the repeating-timepoint editor (`Step3TimepointAssessments.svelte`).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/apgar-scores/` — RESTful routes: `/apgar-scores/` (dashboard,
  `ssr = false`) + `/apgar-scores/[id]` (wizard) + `/apgar-scores/[id]/report`
  (+ `report/pdf` server endpoint).

## Data model

The assessment holds `context`, `identification`, a repeated `timepoints[]`
array (one entry per timepoint, each with `timepointMinutes` and the five signs
`appearance` / `pulse` / `grimace` / `activity` / `respiration`, each `'0'|'1'|'2'|''`),
and `summary`. The 1- and 5-minute timepoints are seeded by default.

## Conventions

- Empty string `''` for unanswered text / enum / sign fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
