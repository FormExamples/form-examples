# Plan: H&P — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard mental-state-examination (documentation / completeness)
front-end and porting the H&P completeness engine from the HTML front-end.

## Done

- Ported the pure completeness engine to TypeScript: `types.ts`,
  `history-and-physical-rules.ts` (the ten required-component rules, vital-sign
  ranges, and shared predicates), `history-and-physical-grader.ts`
  (`calculateHistoryAndPhysicalGrade` — satisfied-components ÷ 10 completeness,
  the core-narrative gate, and the blocking-flag override to `incomplete`),
  `flagged-issues.ts` (the six safety flags, two of which are blocking), and
  `utils.ts` label + Lily-token colour helpers.
- Engine unit tests (`history-and-physical-grader.test.ts`) with a local
  `createDefaultAssessment` fixture (no store import) covering the three status
  classes (complete / partial / incomplete), both blocking flags
  (allergies-not-documented and no-impression-or-plan), abnormal vitals, and the
  flag ordering.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `history-and-physical-examination.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Eight wizard step components (encounter, patient, presenting complaint, past
  history and allergies, social history and systems review, vitals, examination
  and investigations, then impression and plan).
- RESTful routes under `src/routes/history-and-physical-examinations/`: SVAR
  dashboard (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`;
  plus welcome page and themed layout.
- `sample-reports.ts` — four sample records spanning complete / partial /
  incomplete (including both blocking-flag paths), with engine-derived dashboard
  rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
