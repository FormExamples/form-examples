# Plan: Newborn Blood Spot Screening — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard NIPE front-end (a classification form) and porting the blood
spot classification engine from the HTML front-end.

## Done

- Ported the pure classification engine to TypeScript: `types.ts`,
  `bloodspot-rules.ts` (nine-condition metadata, per-condition normalisation,
  referral derivation, overall-outcome precedence, referral status, sample
  quality), `bloodspot-grader.ts` (`gradeBloodspot`), `flagged-issues.ts`, and
  `utils.ts` label + Lily token colour helpers.
- Engine unit tests (`bloodspot-grader.test.ts`) with a local
  `createDefaultAssessment` fixture (no store import) covering each result
  class, the overall-outcome precedence chain (suspected > repeat-required >
  incomplete > declined-only > all-not-suspected), the day 5–8 window
  boundaries (day 4 / 5 / 8 / 9), inadequate-sample and avoidable-repeat
  detection, and the invalid `carrier`-on-non-SCD case.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `newborn-blood-spot-screening.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Seven wizard step components (sample-taker, baby, consent, sample event,
  quality, conditions, summary) with a live overall-outcome readout; the
  conditions step offers `carrier` for SCD only.
- RESTful routes under `src/routes/newborn-blood-spot-screenings/`: SVAR
  dashboard (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`;
  plus welcome page and themed layout.
- `sample-reports.ts` — four sample records spanning all-not-suspected /
  referral-required / repeat-required / incomplete, with engine-derived
  dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`; generic Badge.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
