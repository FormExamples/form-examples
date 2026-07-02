# Plan: Anaesthetic Record — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`quick-sequential-organ-failure-assessment` front-end scaffold and porting the
completeness engine and repeating-row editors from the HTML front-end.

- [x] Pure completeness engine ported from the HTML front-end (`src/lib/engine/`):
      mandatory-item rules, Complete/Partial/Incomplete grader, safety flags
- [x] Vitest tests covering each status class, each mandatory rule's
      satisfied/unsatisfied path, and every safety flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` (objects recursed,
      arrays mutated in place) + localStorage; child-row factories
- [x] Twelve wizard step components, including add/remove repeating-row editors
      for drugs, timed observations, and events; live completeness readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` (0/0) / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
