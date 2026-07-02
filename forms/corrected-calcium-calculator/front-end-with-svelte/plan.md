# Plan: Corrected Calcium Calculator — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`quick-sequential-organ-failure-assessment` front-end.

- [x] Pure calculation engine ported from the HTML front-end (`src/lib/engine/`)
- [x] Vitest tests covering the correction formula, classification boundaries
      (2.20 / 2.60), severity thresholds (1.9 / 3.0), and the missing-input path
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Six wizard step components + live corrected-calcium readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
