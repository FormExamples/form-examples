# Plan: NIPE — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard confusion-assessment-method front-end (a classification form)
and porting the NIPE classification engine from the HTML front-end.

## Done

- Ported the pure classification engine to TypeScript: `types.ts`,
  `nipe-rules.ts` (four component refer-trigger predicates), `nipe-grader.ts`
  (`calculateNipeGrade` — per-component classification, the overall outcome
  roll-up, completeness, and the referral pathways with urgency), `flagged-issues.ts`,
  and `utils.ts` label + Lily token colour helpers.
- Engine unit tests (`nipe-grader.test.ts`) with a local `createDefaultAssessment`
  fixture (no store import) covering each component result, the girls-exclude-testes
  case, the outcome roll-up (satisfactory / refer / incomplete), and every
  referral urgency.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `newborn-and-infant-physical-examination.front-end-with-svelte.<id>.v1`,
  and `createDefaultAssessment()`.
- Nine wizard step components (context, baby, risk factors, eyes, heart, hips,
  testes, systematic, summary) with live per-component and overall readouts;
  the testes step collapses when sex is not male.
- RESTful routes under `src/routes/newborn-and-infant-physical-examinations/`:
  SVAR dashboard (`ssr = false`), `[id]` wizard, `[id]/report`,
  `[id]/report/pdf`; plus welcome page and themed layout.
- `sample-reports.ts` — four sample records spanning satisfactory / refer /
  incomplete, with engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
