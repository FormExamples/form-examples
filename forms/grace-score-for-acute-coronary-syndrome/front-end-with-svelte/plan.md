# Plan: GRACE ACS — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`quick-sequential-organ-failure-assessment` front-end and faithfully porting the
GRACE engine from the HTML front-end.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`) —
      the GRACE weighted regression point model, mortality-band thresholds, and
      creatinine unit normalisation, preserving the exact lookup logic
- [x] Vitest tests covering each band-lookup boundary (age, heart rate, systolic
      BP, creatinine), the Killip and yes/no contributors, the mortality-band
      boundaries (88/89, 108/109, 118/119, 140/141), µmol/L normalisation, the
      max-band rule, and flagged-issue detection
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
      (`grace-score-for-acute-coronary-syndrome.front-end-with-svelte.<id>.v1`)
- [x] Seven wizard step components + live per-variable point read-outs and a
      running GRACE total
- [x] Welcome page, wizard, report, and PDF endpoint routes under
      `/grace-scores-for-acute-coronary-syndrome/`
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows spanning the
      low / intermediate / high mortality bands
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
