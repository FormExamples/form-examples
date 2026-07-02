# Plan: Rockall Score for Upper Gastrointestinal Bleeding — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`child-pugh-score` front-end.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`):
      per-parameter point helpers (age 0/1/2, shock 0/1/2 derived from SBP/HR,
      comorbidity 0/2/3, diagnosis 0/1/2, stigmata 0/2), risk banding
      (low / intermediate / high / clinical-only), a declarative rule table, and
      flagged-issue detection
- [x] Vitest tests covering the age bands (59/60/79/80), the shock derivation
      (hypotension precedence over tachycardia), the clinical score 0-7, the
      full score 0-11 with banding, the clinical-only (no-endoscopy) path, and
      every flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Six wizard step components + live per-parameter points and score readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
