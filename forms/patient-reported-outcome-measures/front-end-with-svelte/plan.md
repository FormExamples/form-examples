# Plan: Patient-Reported Outcome Measures — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`cage-alcohol-questionnaire` / `hospital-dashboard-metrics` front-ends.

- [x] Pure scoring engine ported item-for-item from the verified vanilla-JS
      engine (`../front-end-with-html/js/`) into `src/lib/engine/`
- [x] Vitest tests per instrument: all-best/all-worst SF-36 domains, NDI
      100%/0%/partial + band boundaries, mJOA max/min/boundary/missing-subscale,
      EQ-5D "11111"=1.0 / "33333"≈-0.594 / level-2 & level-3 + N3 term
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] 9 wizard step components (visit details, SF-36v2 x4, NDI, mJOA,
      EQ-5D-3L, summary), sharing a `ScaleItemField.svelte` per-item renderer
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
