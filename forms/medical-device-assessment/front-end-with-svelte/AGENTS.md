# AGENTS — medical-device-assessment `front-end-with-svelte/`

Follows [`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

- The engine `src/lib/engine/device-grader.ts` is a verbatim port of the HTML
  `js/device-grader.js` and is pinned by `device-grader.test.ts` against
  `../examples/personas.json`. Do not change its behaviour from the UI layer.
- Keep `createDefaultAssessment` in `src/lib/engine/defaults.ts`, not in the
  store: the store imports `$app/env`, which Vitest cannot resolve.
- Add or alter questions in `src/lib/config/steps.ts` (fields carry an optional
  `show(state, live)` predicate); hidden questions keep their stored values.
  The `StepNName.svelte` components only select a step definition.
- The store merges loaded data in place with `deepAssign`; never reassign
  `assessment.data`.
- The dashboard route sets `export const ssr = false` (SVAR is not SSR-safe).
- `src/lib/data/sample-reports.ts` samples mirror `examples/personas.json`;
  update them if the personas change.
- `src/lib/api/medical-device-assessments.ts` is the only back-end client
  (`VITE_API_BASE`, default `http://localhost:5150`; the Loco dev config
  enables CORS). `fetchDashboardRows` joins assessments, grades and flags into
  `DashboardRow`s (dashboard keeps the sample rows when the API fails or is
  empty); `submitAssessment` is called by `assessment.save()` after submit:
  find-or-create manufacturer and assessor by name, POST assessment, grade,
  rules, flags. Blocked results save as `draft` and skip the grade POSTs. A
  save failure shows an error on the report and keeps the draft. Rows from the
  API open the blank wizard on click (loading a saved record into the wizard
  is not wired).
- localStorage keys: `medical-device-assessment.front-end-with-svelte.v1` (the
  `new` draft; other ids add `.<id>`), plus `.theme.v1`, `.locale.v1`,
  `.text-size.v1`.
- Verify: `pnpm check`, `pnpm test`, `pnpm build`,
  `pnpm run lint && pnpm run format:check`, `bin/test-form medical-device-assessment`.
