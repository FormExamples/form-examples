# Plan: ZBI — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the gold
`edinburgh-postnatal-depression-scale` front-end and porting the scoring engine
from this form's `front-end-with-html/js/`.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`):
      `zarit-rules.ts` (22 items + short-form subset + response scale),
      `zarit-grader.ts` (additive sum over the active item set + band),
      `flagged-issues.ts`, `utils.ts`, `types.ts`
- [x] Vitest tests covering the ZBI-22 band boundaries (21/22, 40/41, 60/61),
      the all-0 minimum and all-4 maximum (88), missing-item handling, the
      ZBI-12 subset scoring and the `>= 17` high-burden cut-off (16/17), and the
      flag rules
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Five wizard step components (items rendered via `ZaritItemField`) with
      live rating pills, a running total, and instrument-form-aware scoring
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
