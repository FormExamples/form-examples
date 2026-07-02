# Plan: Abdominal Aortic Aneurysm (AAA) Screening — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`corrected-calcium-calculator` front-end (threshold-classifier pattern).

- [x] Pure classification engine ported from the HTML front-end
      (`src/lib/engine/`): diameter thresholds 3.0 / 4.5 / 5.5 cm, non-visualised
      guard, surveillance-band mapping, and growth calculation
- [x] Vitest tests covering each diameter boundary (2.9/3.0, 4.4/4.5, 5.4/5.5 cm),
      the non-visualised guard, every category, growth, and every flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
      (`abdominal-aortic-aneurysm-screening.front-end-with-svelte.<id>.v1`)
- [x] Six wizard step components + live classification readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows (5 samples
      spanning normal / small / medium+growth / large-symptomatic / non-visualised)
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` (0/0) / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
