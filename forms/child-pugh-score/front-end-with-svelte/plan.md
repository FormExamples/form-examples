# Plan: Child-Pugh Score — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`corrected-calcium-calculator` front-end.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`):
      per-parameter 1-3 point helpers, class banding (A/B/C), declarative rule
      table, and flagged-issue detection
- [x] Vitest tests covering every threshold boundary (bilirubin 34/50, albumin
      28/35, INR 1.7/2.3), the INR-preferred / PT-fallback logic, all-min /
      all-max, the class boundaries (6/7, 9/10), partial totals, and every flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Eight wizard step components + live per-parameter points and score readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
