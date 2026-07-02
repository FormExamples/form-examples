# Plan: LD Annual Health Check — SvelteKit front-end (form + dashboard)

## Status: built

Consolidated `front-end-with-svelte/` built greenfield, mirroring the completed
`mental-state-examination/front-end-with-svelte/` completeness template and
porting the engine from `front-end-with-html/js/{types,rules,grader,flags}.js`.

## Done

- Pure completeness engine in TypeScript:
  - `types.ts` — `AssessmentData` (10 sections) + grading types.
  - `ld-health-check-rules.ts` — 18 required-component rules + `isRecorded`
    (sentinel `not-recorded` / `not-assessed` / `not-reviewed` / `not-done` / `''`
    do not count; `declined` / `not-applicable` / `not-eligible` / `no-carer` do).
  - `ld-health-check-grader.ts` — `calculateHealthCheckGrade`, completeness %,
    Health Action Plan gate (produced AND shared), `complete` only when all 18
    components completed AND the plan is complete.
  - `flagged-issues.ts` — STOMP, no Health Action Plan, unaddressed physical
    health, dysphagia risk, constipation risk, missing screening uptake,
    reasonable adjustments not recorded, incomplete check.
  - `utils.ts` — label + Lily-token colour helpers.
- `ld-health-check-grader.test.ts` — local `createDefaultAssessment` fixture (no
  store import); covers the 18 components, the completeness rounding, the Health
  Action Plan gate, and the STOMP flag's three trigger paths.
- id-keyed store (`deepAssign`, `createDefaultAssessment()`, localStorage key
  `learning-disability-annual-health-check.front-end-with-svelte.<id>.v1`).
- `config/steps.ts` (10 steps), `config/themes.ts` (storage key rekeyed).
- `data/sample-reports.ts` — four samples spanning complete / incomplete,
  managed STOMP, STOMP flag, and dysphagia / no-HAP; engine-derived rows.
- Ten step components (`StepNName.svelte`), the conditional STOMP block in
  Step 6, and a live completeness + Health Action Plan readout in Step 10.
- Routes under `src/routes/learning-disability-annual-health-checks/`: SVAR
  dashboard (`ssr = false`), `[id]` wizard, report, and PDF endpoint. Welcome
  page + themed layout.
- `report/pdf-builder.ts` — `pdfmake` document (completeness + Health Action
  Plan, not a score).

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
