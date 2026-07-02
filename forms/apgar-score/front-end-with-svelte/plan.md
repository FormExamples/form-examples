# Plan: Apgar Score — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`quick-sequential-organ-failure-assessment` front-end and following the
greenfield Svelte recipe.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`)
- [x] Vitest tests covering each band boundary (3/4, 6/7), every trend
      direction, the conditional 10-minute rule, and each flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage; the
      repeated `timepoints` array is replaced wholesale on load
- [x] Four wizard step components, including the repeating-timepoint editor
      with live per-timepoint totals and bands
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
