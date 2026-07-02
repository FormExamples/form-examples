# Plan: Glasgow-Blatchford Bleeding Score — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`child-pugh-score` front-end.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`):
      weighted per-parameter band helpers (blood urea, sex-specific haemoglobin,
      systolic BP, pulse, melaena, syncope, hepatic disease, cardiac failure),
      risk banding (very-low / low-moderate / high), declarative rule table, and
      flagged-issue detection
- [x] Vitest tests covering every band boundary (urea 6.5/8.0/10.0/25.0; Hb
      100/120/130 for both sexes and the unknown-sex fallback; SBP 90/100/110;
      pulse 100), the total endpoints 0 and 23, completeness, and every flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
      (`glasgow-blatchford-bleeding-score.front-end-with-svelte.<id>.v1`)
- [x] Six wizard step components + live per-parameter points and score readout
- [x] Welcome page, wizard, report, and PDF endpoint routes under
      `/glasgow-blatchford-bleeding-scores/`
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
