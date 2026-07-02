# Plan: CAM — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard qSOFA front-end and porting the CAM classification engine
from the HTML front-end.

## Done

- Ported the pure classification engine to TypeScript: `types.ts`,
  `cam-rules.ts` (four boolean feature predicates), `cam-grader.ts`
  (`calculateCamGrade` — the `1 AND 2 AND (3 OR 4)` algorithm plus the CAM-ICU
  RASS -4/-5 arousal gate), `flagged-issues.ts`, and `utils.ts` label + Lily
  token colour helpers.
- Engine unit tests (`cam-grader.test.ts`) with a local `createDefaultAssessment`
  fixture (no store import) covering each satisfying / non-satisfying feature
  pattern and the `unable-to-assess` edge case.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `confusion-assessment-method.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Eight wizard step components (assessor, patient, feature 1-4, observations,
  result) with live classification readout; conditional RASS input for CAM-ICU.
- RESTful routes under `src/routes/confusion-assessment-methods/`: SVAR
  dashboard (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`;
  plus welcome page and themed layout.
- `sample-reports.ts` — four sample records spanning present / absent /
  unable-to-assess, with engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
