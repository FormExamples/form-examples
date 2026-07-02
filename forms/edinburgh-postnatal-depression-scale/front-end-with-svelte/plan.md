# Plan: EPDS — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the gold
`quick-sequential-organ-failure-assessment` front-end and porting the scoring
engine from this form's `front-end-with-html/js/`.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`):
      `epds-rules.ts` (ten items + reverse-scoring), `epds-grader.ts`,
      `flagged-issues.ts`, `utils.ts`, `types.ts`
- [x] Vitest tests covering the reverse-score mapping, band boundaries (9/10
      and 12/13), full 0-30 range, and the item-10 self-harm flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Six wizard step components (items rendered via `EpdsItemField`) with live
      symptom-score pills and a running total
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
