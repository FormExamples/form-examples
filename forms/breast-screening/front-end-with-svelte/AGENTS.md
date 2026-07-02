# Breast Screening — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Breast Screening specification and classification engine. Lily Svelte
headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a result-**classification** form — the engine derives an eligibility
status and maps the reading outcome (refined by the five-point imaging
classification after a recall) to a screening outcome and outcome band via an
ordered first-match pathway. There is no numeric score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `breast-screening-rules.ts`, `breast-screening-grader.ts`, `flagged-issues.ts`)
  + `breast-screening-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (7 steps: context, identification, eligibility, mammogram, reading,
  assessment, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/breast-screenings/` — RESTful routes: `/breast-screenings/`
  (dashboard, `ssr = false`) + `/breast-screenings/[id]` (wizard) +
  `/breast-screenings/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Eligibility gate → ordered first-match outcome pathway (no total):

```
eligibilityStatus = deriveEligibility(d)   // symptomatic → higher-risk → age → eligible
screeningOutcome  = first outcomeRule whose evaluate(d) is true (else '')
outcomeBand       = that rule's band (else 'incomplete')
status            = isComplete(d) && screeningOutcome !== '' ? 'complete' : 'incomplete'
```

`calculateGrade` returns the eligibility status, reading outcome, imaging
classification, screening outcome, outcome band, completeness status, the
fired-rule audit trail, and the flagged issues.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- The imaging classification is numeric (1-5) or `null`; the select coerces its
  string value so the grader can compare it strictly.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
