# Plan: Heart Failure Annual Review — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard mental-state-examination (classification / completeness)
front-end and porting the heart-failure-review classification engine from the
HTML front-end.

## Done

- Ported the pure classification engine to TypeScript: `types.ts`,
  `heart-failure-review-rules.ts` (the four pillars, the six review-domain
  documentation rules, the indicated-pillar logic),
  `heart-failure-review-grader.ts` (`gradeReview` — NYHA functional status,
  four-pillar medication optimization, documented-domains ÷ 6 completeness),
  `flagged-issues.ts` (urgent review, optimization gap, hyperkalaemia,
  hypokalaemia, renal impairment, fluid overload, missing monitoring, incomplete
  review), and `utils.ts` label + Lily-token colour helpers.
- Engine unit tests (`heart-failure-review-grader.test.ts`) with a local
  `createDefaultAssessment` fixture (no store import) covering each NYHA class,
  the HFrEF four-pillar optimization transitions (optimized / partial /
  suboptimal / contraindicated-as-addressed), the HFmrEF/HFpEF and unknown
  pillar sets, the completeness bands, and each safety-flag threshold.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `heart-failure-review.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Nine wizard step components (context, patient & diagnosis, functional status,
  fluid status, investigations, medication optimization with all four pillars,
  devices, vaccinations, and a summary with a live status readout).
- RESTful routes under `src/routes/heart-failure-reviews/`: SVAR dashboard
  (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`; plus welcome
  page and themed layout.
- `sample-reports.ts` — four sample records spanning NYHA status, optimization
  status, and completeness, with engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
