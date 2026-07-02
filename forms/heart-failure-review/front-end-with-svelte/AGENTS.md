# Heart Failure Annual Review — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and status-classification** form — the engine derives
an NYHA functional status (`stable` / `symptomatic` / `advanced` / `unknown`), a
four-pillar medication-optimisation status (`optimised` / `partial` /
`suboptimal` / `not-applicable`), a review-completeness grade (`complete` /
`partial` / `incomplete`) with a completeness percentage, and a set of safety
flags. There is no numeric score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `heart-failure-review-rules.ts`, `heart-failure-review-grader.ts`,
  `flagged-issues.ts`) + `heart-failure-review-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (9 steps: context, patient & diagnosis, functional status, fluid status,
  investigations, medication optimisation, devices, vaccinations, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (statuses, not score).
- `src/routes/heart-failure-reviews/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Four independent documentation outputs (no total):

```
functionalStatus  = nyhaClass == null ? 'unknown'
                  : nyhaClass <= 2     ? 'stable'
                  : nyhaClass == 3     ? 'symptomatic'
                  :                      'advanced'   // NYHA IV
indicatedPillars  = 4 for HFrEF, 1 (SGLT2i) for HFmrEF/HFpEF, 0 otherwise
optimisation      = indicatedPillars == 0 ? 'not-applicable'
                  : counted == indicatedPillars ? 'optimised'
                  : prescribedPillars == 0 ? 'suboptimal' : 'partial'
completenessScore = round(100 * documentedDomains / 6)
reviewStatus      = documented == 6 ? 'complete'
                  : documented >= 4 ? 'partial' : 'incomplete'
```

A pillar documented `contraindicated` / `not-tolerated` counts as addressed.
`gradeReview` returns the functional status, medication optimisation, review
status, completeness score, the per-domain documented flags, the fired-rule
audit trail, and the safety flags.

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
