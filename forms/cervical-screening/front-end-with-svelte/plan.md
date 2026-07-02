# Plan: Cervical Screening — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard newborn-and-infant-physical-examination front-end (a
classification form) and porting the cervical-screening classification engine
from the HTML front-end.

## Done

- Ported the pure classification engine to TypeScript: `types.ts`,
  `cervical-screening-rules.ts` (the gated first-match `classificationRules`
  plus the `notEligible` null-age guard), `cervical-screening-grader.ts`
  (`calculateGrade` — first-match result class + management action, completeness
  status, fired-rule audit trail), `flagged-issues.ts` (eight independent safety
  flags), and `utils.ts` label + Lily token colour helpers.
- Engine unit tests (`cervical-screening-grader.test.ts`) with a local
  `createDefaultAssessment` fixture (no store import) covering every result
  class and management action, the eligibility and adequacy gates, the null-age
  guard, each reflex-cytology branch, and each flagged issue.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `cervical-screening.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Nine wizard step components (context, patient, eligibility, consent, symptoms,
  adequacy, hpv, cytology, note) with a live result readout; the cytology step
  collapses when the primary hrHPV result is not positive.
- RESTful routes under `src/routes/cervical-screenings/`: SVAR dashboard
  (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`; plus welcome
  page and themed layout.
- `sample-reports.ts` — four sample records spanning HPV-negative, HPV-positive
  normal, HPV-positive high-grade (+ symptomatic), and inadequate, with
  engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
