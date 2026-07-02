# Plan: PERC — SvelteKit front-end (form + dashboard)

## Status: complete

Greenfield SvelteKit front-end for the Pulmonary Embolism Rule-out Criteria,
mirroring the completed `confusion-assessment-method` sibling (a
classification form). `pnpm check` / `build` / `vitest` all green.

## Done

- [x] Scaffold copied from the CAM sibling (Lily UI component set, themes,
      configs, app shell).
- [x] Pure classification engine ported from `front-end-with-html/js/`:
      `types.ts`, `utils.ts`, `perc-rules.ts`, `perc-grader.ts`,
      `flagged-issues.ts`.
- [x] `perc-grader.test.ts` — threshold boundaries (age 49/50, HR 99/100,
      SpO2 94/95), each criterion failing in isolation, the all-satisfied case,
      the not-low pre-test override, missing-input handling, and flag detection.
      Uses a local `createDefaultAssessment` fixture (no store import).
- [x] Id-keyed reactive store with localStorage persistence
      (`pulmonary-embolism-rule-out-criteria.front-end-with-svelte.<id>.v1`),
      `deepAssign` deep-merge, and `createDefaultAssessment()`.
- [x] Six step components (context, patient, pre-test, vitals, criteria,
      result) with live per-criterion and classification pills.
- [x] Sample records + engine-derived dashboard rows (2 PERC-negative /
      PERC-positive mix, 4 samples).
- [x] `pdf-builder.ts` — classification-based report (not a score).
- [x] RESTful routes under `pulmonary-embolism-rule-out-criterias/`
      (dashboard `ssr = false`, `[id]` wizard, report, report/pdf) + welcome +
      layout.
- [x] Docs (`index.md`, `AGENTS.md`, this plan) adapted to PERC.

## Verify

```sh
pnpm install --prefer-offline
pnpm run check
pnpm run build
pnpm exec vitest run
```
