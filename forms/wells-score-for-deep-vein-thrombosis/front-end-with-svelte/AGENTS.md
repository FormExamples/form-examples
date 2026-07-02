# Wells DVT — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Wells DVT specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `wells-dvt-rules.ts`, `wells-dvt-grader.ts`, `flagged-issues.ts`) +
  `wells-dvt-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/wells-score-for-deep-vein-thromboses/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

Nine clinical criteria (each +1) plus a −2 adjustment when an alternative
diagnosis is at least as likely as DVT. Total −2..9.

- `wellsScore = (sum of +1 per 'yes' criterion) − (alternative == 'yes' ? 2 : 0)`
- `twoLevelBand = wellsScore >= 2 ? 'likely' : 'unlikely'`
- `threeLevelBand = wellsScore >= 3 ? 'high' : wellsScore >= 1 ? 'moderate' : 'low'`
- `recommendedInvestigation = twoLevelBand == 'likely' ? 'proximal-leg-vein-ultrasound' : 'd-dimer'`

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
