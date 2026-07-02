# Plan: Bhutani Bilirubin Nomogram — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`corrected-calcium-calculator` front-end (numeric-input classifier pattern).

- [x] Pure classification engine ported from the HTML front-end
      (`src/lib/engine/`): tabulated Bhutani percentile tracks + NICE
      gestation-specific threshold curves, linear interpolation, gestation-band
      selection, zone lookup + treatment-threshold comparison
- [x] Vitest tests covering each zone boundary (below/at p40, p75, p95), each
      treatment-threshold boundary (at the phototherapy and exchange lines),
      gestation-curve selection, out-of-range age clamping, and missing inputs
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Five wizard step components + live risk-zone / threshold readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
- Add a rapid-rise flag once a prior TSB / prior age is captured by the form.
