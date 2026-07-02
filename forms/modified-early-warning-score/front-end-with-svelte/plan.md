# Plan: MEWS — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit build, mirroring the completed
`national-early-warning-score-2` greenfield sibling and the gold
`cardiology-assessment` front-end.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`)
- [x] Vitest tests covering each per-parameter allocation-band boundary, the
      aggregate bands (1/2 and 4/5), the single-parameter=3 trigger, and the
      safety flags
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Eight wizard step components + live per-parameter subscore pills
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
