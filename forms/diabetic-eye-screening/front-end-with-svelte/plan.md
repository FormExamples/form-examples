# Plan: Diabetic Eye Screening — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard cervical-screening front-end (a screening classification form)
and porting the diabetic-eye-screening classification engine from the HTML
front-end (`front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- Ported the pure classification engine to TypeScript: `types.ts`,
  `diabetic-eye-rules.ts` (the worst-eye derivation helpers — `worstRetinopathy`
  by the `RETINOPATHY_SEVERITY` ranking, `worstMaculopathy`, `anyUngradable`,
  `lowRiskEligible`, `deriveContext` — plus the gated first-match
  `classificationRules`), `diabetic-eye-grader.ts` (`calculateGrade` — worst-eye
  summary + first-match outcome, referral, recall interval, completeness status,
  fired-rule audit trail), `flagged-issues.ts` (eight independent safety flags),
  and `utils.ts` label + Lily token colour helpers.
- Engine unit tests (`diabetic-eye-grader.test.ts`) with a local
  `createDefaultAssessment` fixture (no store import) covering worst-eye
  selection across mismatched eyes, the severity ranking, the ungradable-eye
  exclusion, every recall / referral outcome, completeness, and each flagged
  issue.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `diabetic-eye-screening.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Five wizard step components (grading context, patient identification, right
  eye grading, left eye grading, summary + note) with a live worst-eye outcome
  readout.
- RESTful routes under `src/routes/diabetic-eye-screenings/`: SVAR dashboard
  (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`; plus welcome
  page and themed layout.
- `sample-reports.ts` — four sample records spanning urgent proliferative (R3A +
  M1), 6-month surveillance (R2), slit-lamp (ungradable), and extended
  24-monthly (R0/M0 low-risk), with engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
