# Plan: PEWS — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit build, mirroring the completed
`national-early-warning-score-2` greenfield sibling (aggregate-vitals
early-warning pattern) and the gold `cardiology-assessment` front-end.

- [x] Pure age-banded scoring engine ported from the HTML front-end
      (`src/lib/engine/`): `pews-rules.ts` age-band tables → `pews-grader.ts`
      aggregate + escalation → `flagged-issues.ts`
- [x] Vitest tests covering the age-band rate boundaries (the key logic), every
      parameter's 0-3 thresholds, the single-parameter=3 override, the concern
      triggers, each escalation-band boundary, and the safety flags
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Seven wizard step components (incl. the age-band selector) + live
      per-parameter subscore pills
- [x] Welcome page, wizard, report, and PDF endpoint routes under
      `/paediatric-early-warning-scores/`
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
