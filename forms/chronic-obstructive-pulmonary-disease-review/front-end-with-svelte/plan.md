# Plan: COPD Review — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard mental-state-examination (classification / completeness)
front-end and porting the COPD-review grading engine from the HTML front-end.

## Done

- Ported the pure grading engine to TypeScript: `types.ts`,
  `copd-review-rules.ts` (GOLD / symptom / exacerbation / ABE threshold helpers,
  the classification rules, and the core / supporting completeness-component
  tables), `copd-review-grader.ts` (`gradeCopdReview` — the four independent
  outputs plus the review-completeness grade), `flagged-issues.ts` (the six
  clinical flags), and `utils.ts` label + Lily-token colour helpers.
- Engine unit tests (`copd-review-grader.test.ts`) with a local
  `createDefaultAssessment` fixture (no store import) covering each GOLD
  boundary (FEV₁ % 80/79, 50/49, 30/29), each symptom threshold (mMRC 1/2,
  CAT 9/10), each exacerbation threshold (1/2 moderate, 0/1 hospitalized), every
  ABE group, and every completeness grade.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `chronic-obstructive-pulmonary-disease-review.front-end-with-svelte.<id>.v1`,
  and `createDefaultAssessment()`.
- Eleven wizard step components (context, diagnosis, spirometry, symptoms,
  exacerbations, smoking, inhaler, vaccinations, rehab & oxygen,
  self-management, summary).
- RESTful routes under `src/routes/chronic-obstructive-pulmonary-disease-reviews/`:
  SVAR dashboard (`ssr = false`), `[id]` wizard, `[id]/report`,
  `[id]/report/pdf`; plus welcome page and themed layout.
- `sample-reports.ts` — four sample records spanning the GOLD grade range (1–4
  and ungraded), every ABE group (A / B / E and unassigned), and every
  completeness grade, with engine-derived dashboard rows.
- Full Lily token migration; generic `Badge.svelte`; `Form.svelte` carries
  `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
