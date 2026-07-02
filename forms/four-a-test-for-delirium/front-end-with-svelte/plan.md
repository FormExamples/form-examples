# Plan: 4AT — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`quick-sequential-organ-failure-assessment` front-end (itself modelled on the
gold `cardiology-assessment`).

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`)
- [x] Vitest tests covering each item band and totals 0-12
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Six wizard step components + live per-item score pills
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
