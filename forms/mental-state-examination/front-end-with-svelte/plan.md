# Plan: MSE — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated `front-end-with-svelte/` built by mirroring
the gold-standard confusion-assessment-method (classification / completeness)
front-end and porting the MSE completeness-and-risk engine from the HTML
front-end.

## Done

- Ported the pure completeness-and-risk engine to TypeScript: `types.ts`,
  `mse-rules.ts` (the seven ASEPTIC domain-documentation rules),
  `mse-grader.ts` (`calculateMseGrade` — documented-domains ÷ 7 completeness
  and the priority-driven risk level), `flagged-issues.ts` (the twelve safety
  flags), and `utils.ts` label + Lily-token colour helpers.
- Engine unit tests (`mse-grader.test.ts`, 17 tests) with a local
  `createDefaultAssessment` fixture (no store import) covering the completeness
  boundary (none / partial / all seven documented), every risk level, and each
  key flag threshold.
- Id-keyed Svelte 5 store with `deepAssign` in-place deep-merge, localStorage
  key `mental-state-examination.front-end-with-svelte.<id>.v1`, and
  `createDefaultAssessment()`.
- Ten wizard step components (context, patient, and the seven ASEPTIC domains,
  then a summary with a live completeness / risk readout).
- RESTful routes under `src/routes/mental-state-examinations/`: SVAR dashboard
  (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`; plus welcome
  page and themed layout.
- `sample-reports.ts` — four sample records spanning high / moderate / low risk
  and complete / partial completeness, with engine-derived dashboard rows.
- Full Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
