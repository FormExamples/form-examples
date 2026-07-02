# COPD Review — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the COPD-review specification and grading engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **severity-classification and completeness** form — the engine derives
a GOLD airflow-limitation grade (1–4), a combined ABE assessment group (A/B/E),
and a review-completeness grade (complete / partial / incomplete). There is no
numeric score.

## Layout

- `src/lib/engine/` — pure grading engine (`types.ts`, `utils.ts`,
  `copd-review-rules.ts`, `copd-review-grader.ts`, `flagged-issues.ts`) +
  `copd-review-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (11 steps: context, diagnosis, spirometry, symptoms, exacerbations, smoking,
  inhaler, vaccinations, rehab & oxygen, self-management, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/chronic-obstructive-pulmonary-disease-reviews/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Four independent derivations plus the completeness grade (no total):

```
goldGrade        = FEV₁ % predicted banded ≥80→1, ≥50→2, ≥30→3, <30→4; null when unrecorded
symptomBurden    = (mMRC ≥ 2) or (CAT ≥ 10)             ? 'high' : 'low'
exacerbationRisk = (≥ 2 moderate) or (≥ 1 hospitalised) ? 'high' : 'low'
abeGroup         = no axis data ? null : exac high ? 'E' : symptom high ? 'B' : 'A'
reviewStatus     = any core missing ? 'incomplete'
                   : any supporting missing ? 'partial' : 'complete'
```

`gradeCopdReview` returns the GOLD grade, the two axes, the ABE group, the
review-completeness grade, the fired-rule audit trail, and the clinical flags.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- HTML entities (`&lt;`, `&gt;`, `&le;`, `&ge;`) in Svelte template text.
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
