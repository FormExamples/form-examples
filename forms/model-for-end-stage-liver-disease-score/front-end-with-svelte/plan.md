# Plan: MELD Score — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`corrected-calcium-calculator` front-end.

- [x] Pure calculation engine ported from the HTML front-end (`src/lib/engine/`):
      weighted logarithmic MELD / MELD-Na / MELD 3.0 formula, dialysis creatinine
      rule, value bounds, unit conversion, 6-40 clamp, mortality bands
- [x] Vitest tests covering a known MELD ballpark, the < 1.0 floor, the dialysis
      rule (≥ 2 sessions and CVVHD → creatinine 4.0), unit conversion, the 6-40
      clamp, the MELD-Na sodium gate, per-variant required inputs, band
      boundaries, and flag detection
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Eight wizard step components with conditional sodium/albumin visibility and
      a live MELD readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows spanning every
      mortality band plus a dialysis case
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
