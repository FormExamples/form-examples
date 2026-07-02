# Wells PE — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Wells PE specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `wells-pe-rules.ts`, `wells-pe-grader.ts`, `flagged-issues.ts`) +
  `wells-pe-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/wells-score-for-pulmonary-embolisms/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

Seven weighted criteria — clinical signs of DVT (+3), PE most likely (+3),
heart rate > 100 (+1.5), immobilisation/surgery (+1.5), previous DVT/PE (+1.5),
haemoptysis (+1), malignancy (+1). Total 0..12.5.

- `wellsScore = sum of weighted points for each positive criterion`
- `twoLevelBand = wellsScore > 4 ? 'likely' : 'unlikely'`
- `threeLevelBand = wellsScore < 2 ? 'low' : wellsScore <= 6 ? 'moderate' : 'high'`
- `recommendedPathway = twoLevelBand == 'likely' ? 'ctpa' : 'd-dimer'`
- A missing (null) heart rate contributes 0 points and raises a data-completeness flag.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.
- HTML entities (`&lt; &gt; &le; &ge;`) for comparison operators in template text.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
