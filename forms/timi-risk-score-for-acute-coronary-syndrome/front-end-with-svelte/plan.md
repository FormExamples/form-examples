# Plan: TIMI UA/NSTEMI — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit front-end, mirroring the gold
`quick-sequential-organ-failure-assessment` consolidation and the greenfield
Svelte recipe.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`)
- [x] Vitest tests covering each criterion, the band transitions, and totals 0-7
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Seven wizard step components + live per-criterion point pills
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
