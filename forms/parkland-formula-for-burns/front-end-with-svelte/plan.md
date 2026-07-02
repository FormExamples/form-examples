# Plan: Parkland Formula for Burns — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`corrected-calcium-calculator` front-end.

- [x] Pure calculation engine ported from the HTML front-end (`src/lib/engine/`)
- [x] Vitest tests covering the base formula (70 kg × 30% → 8400 mL / 4200 mL per
      phase), the 50/50 split, the time-since-injury offset, the overdue
      (> 8 h → null first-phase rate) path, the urine-output band, and every flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Seven wizard step components + live total-volume / plan-status readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
