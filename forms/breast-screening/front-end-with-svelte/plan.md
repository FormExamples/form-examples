# Plan: Breast Screening — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard NIPE front-end (a screening-classification form) and porting
the breast-screening classification engine from the HTML front-end.

## Done

- Ported the pure classification engine to TypeScript: `types.ts`,
  `breast-screening-rules.ts` (`deriveEligibility` gate + ordered first-match
  `outcomeRules`), `breast-screening-grader.ts` (`calculateGrade` — eligibility,
  first-match screening outcome and band, completeness), `flagged-issues.ts`,
  and `utils.ts` label + Lily token colour helpers.
- Engine unit tests (`breast-screening-grader.test.ts`) with a local
  `createDefaultAssessment` fixture (no store import) covering the eligibility
  gate (symptomatic, higher-risk, age boundaries 49/50/70/71), every reading
  outcome, imaging classifications 1-5, the recalled-but-not-assessed case, the
  incomplete record, and flag detection.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `breast-screening.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Seven wizard step components (context, identification, eligibility, mammogram,
  reading, assessment, summary) with a live outcome readout; the assessment
  modalities and imaging classification appear once the assessment clinic is
  attended.
- RESTful routes under `src/routes/breast-screenings/`: SVAR dashboard
  (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`; plus welcome
  page and themed layout.
- `sample-reports.ts` — four sample records spanning routine / assessment /
  urgent / referral outcomes, with engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
