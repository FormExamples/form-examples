# Plan: QRISK3 — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`quick-sequential-organ-failure-assessment` front-end.

- [x] Pure scoring engine ported faithfully from the HTML front-end
      (`src/lib/engine/`), coefficient tables copied verbatim
- [x] Vitest tests: LP-0 baseline anchors, a hand-summed multi-factor case,
      male-only erectile-dysfunction term, optional Townsend default, band
      boundaries, and the flag rules
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Eight wizard step components + live 10-year risk / heart age
- [x] Welcome page, wizard, report (with weighted-contribution audit), and PDF
      endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] Representative-model disclaimer surfaced on the welcome page and report
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Replace the representative coefficients with the open-source ClinRisk
  QRISK3-2017 reference implementation for clinical use.
- Wire the dashboard to the live back-end API (currently sample data only).
