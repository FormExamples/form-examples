# Plan: Hypertension Annual Review — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard mental-state-examination (classification / completeness)
front-end and porting the hypertension-review control-classification-and-
completeness engine from the HTML front-end.

## Done

- Ported the pure engine to TypeScript: `types.ts`, `utils.ts` (presence
  predicate, label + Lily-token colour helpers),
  `hypertension-review-rules.ts` (tightest-target selection, control
  classification, staging, and the review-completeness components),
  `hypertension-review-grader.ts` (`review` — control status, review status,
  per-component documented flags, and the fired-rule audit trail), and
  `flagged-issues.ts` (the eight flags).
- Engine unit tests (`hypertension-review-grader.test.ts`) with a local
  `createDefaultAssessment` fixture (no store import) covering each target
  group, the 180/120 severe boundary, the 140/90 and 141/90 target boundaries,
  each hypertension stage, each review-status level, and each flag.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `hypertension-review.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Twelve wizard step components (context, patient, diagnosis, clinic BP, home
  BP, medication, CV risk, bloods, urine ACR, lifestyle, complications,
  summary).
- RESTful routes under `src/routes/hypertension-reviews/`: SVAR dashboard
  (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`; plus welcome
  page and themed layout.
- `sample-reports.ts` — four sample records spanning severe-uncontrolled,
  uncontrolled/partial, controlled/complete, and incomplete, with
  engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
