# Plan: Emergency Department Triage Note — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`national-early-warning-score-2` greenfield sibling.

- [x] Pure classification engine ported from the HTML front-end (`src/lib/engine/`)
- [x] Vitest tests covering each NEWS2 per-parameter band, MTS levels 1-5,
      NEWS2 escalation thresholds, pain-score bands, most-urgent-wins selection,
      and the safety flags
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Eight wizard step components + live NEWS2 subscore pills and priority readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
