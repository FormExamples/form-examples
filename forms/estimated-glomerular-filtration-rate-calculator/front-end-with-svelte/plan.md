# Plan: eGFR Calculator — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`corrected-calcium-calculator` front-end (formula calculator).

- [x] Pure calculation engine ported faithfully from the HTML front-end
      (`src/lib/engine/`) — CKD-EPI 2021 creatinine coefficients preserved
      exactly (÷ 88.42; κ 0.7/0.9; α −0.241/−0.302; 142 × … × 0.9938^age ×
      1.012)
- [x] Vitest tests covering the µmol/L → mg/dL conversion, a known male/female
      creatinine → eGFR ballpark, the G-stage banding boundaries (90/60/45/30/15),
      the missing-input path, and the flag rules
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
      (`estimated-glomerular-filtration-rate-calculator.front-end-with-svelte.<id>.v1`)
- [x] Four wizard step components + live eGFR readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows spanning
      G1–G5
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
- Optional cystatin-C and MDRD equations (recorded for context only today).
