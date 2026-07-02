# Plan: CAGE — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`quick-sequential-organ-failure-assessment` front-end.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`)
- [x] Vitest tests covering each item, totals 0-4, and the >= 2 threshold
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Seven wizard step components + live per-criterion point pills
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
