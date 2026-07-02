# Plan: ReSPECT — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`quick-sequential-organ-failure-assessment` front-end and porting the
completeness engine from `front-end-with-html/js/`.

- [x] Pure completeness engine ported from the HTML front-end (`src/lib/engine/`):
      eight mandatory rules, conditional capacity rule, completeness field-slots,
      six safety / governance flags
- [x] Vitest tests covering each mandatory rule (pass and fail), the conditional
      capacity branch, completeness arithmetic, and every flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Nine wizard step components (conditional capacity section) + live
      completeness status on the summary step
- [x] Welcome page, wizard, report, and PDF endpoint routes under `/plans`
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
