# Plan: C-SSRS — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the completed confusion-assessment-method front-end (a sibling classification
form) and porting the C-SSRS classification engine from the HTML front-end.

## Done

- Ported the pure classification engine to TypeScript: `types.ts`,
  `cssrs-rules.ts` (ideation Q1-Q5 ordinal predicates, behaviour categories,
  lethality thresholds), `cssrs-grader.ts` (`calculateCssrsGrade` — highest
  affirmative ideation level 0-5, suicidal-behaviour presence and recency,
  lethality, and the Low / Moderate / High risk-tier derivation with a
  management recommendation), `flagged-issues.ts`, and `utils.ts` label + Lily
  token colour helpers.
- Engine unit tests (`cssrs-grader.test.ts`) with a local
  `createDefaultAssessment` fixture (no store import) covering each ideation
  level 0-5, every behaviour category, both recency windows, the lethality
  thresholds (actual 2/3, potential 1/2), and each risk tier.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `columbia-suicide-severity-rating-scale.front-end-with-svelte.<id>.v1`,
  and `createDefaultAssessment()`.
- Eight wizard step components (context, patient, ideation, intensity,
  behaviour, lethality, means, summary) with live ideation-level and risk-tier
  readouts; potential-lethality input gated on actual lethality 0.
- RESTful routes under `src/routes/columbia-suicide-severity-rating-scales/`:
  SVAR dashboard (`ssr = false`), `[id]` wizard, `[id]/report`,
  `[id]/report/pdf`; plus welcome page and themed layout.
- `sample-reports.ts` — four sample records spanning Low / Moderate / High risk
  (passive ideation, active-with-methods, active plan and intent, recent
  high-lethality attempt), with engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
