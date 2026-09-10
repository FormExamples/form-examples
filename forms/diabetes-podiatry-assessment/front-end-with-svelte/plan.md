# Plan: Diabetes Podiatry Assessment — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard diabetes-eye-screening front-end (a sibling
patient+clinician+one-main-table-with-two-bilateral-examination-blocks
risk-classification form) and porting the diabetes-podiatry-assessment
classification engine from the HTML front-end
(`front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- Ported the pure classification engine to TypeScript: `types.ts`,
  `podiatry-rules.ts` (the per-foot risk-factor count and override helpers —
  `perFootRiskFactorCount`, `perFootBaseRisk`, `perFootRisk`, `hasHistory`,
  `deriveContext` — plus the gated first-match `reviewRules`),
  `podiatry-grader.ts` (`calculateGrade` — per-foot + overall risk, review
  pathway, referral, review interval, completeness status, fired-rule audit
  trail), `flagged-issues.ts` (nine independent safety flags), and `utils.ts`
  label + Lily token colour helpers.
- Engine unit tests split as `podiatry-rules.test.ts` (risk-factor counting,
  base-risk boundaries, per-foot overrides, history detection, worst-foot
  context derivation across mismatched feet, rule-id uniqueness) and
  `podiatry-grader.test.ts` (end-to-end `calculateGrade` for every risk
  category boundary, every override — active ulcer, suspected Charcot,
  previous ulcer/amputation, renal replacement therapy — mismatched feet,
  completeness, and every flagged issue), both with a local
  `createDefaultAssessment` fixture (no store import).
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `diabetes-podiatry-assessment.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Five wizard step components (assessment context, patient identification &
  risk factors, right foot examination, left foot examination, summary +
  note) with a live per-foot and overall risk readout.
- RESTful routes under
  `src/routes/diabetes-podiatry-assessment/diabetes-podiatry-assessments/`:
  SVAR dashboard (`ssr = false`), `[id]` wizard, `[id]/report`,
  `[id]/report/pdf`; plus welcome page and themed layout.
- `sample-reports.ts` — five sample records spanning low risk (annual
  review), moderate (one factor), high with combined factors (no history, 3
  months), high with ulcer history (1 month), and active-urgent (active
  ulcer, mismatched feet), with engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
