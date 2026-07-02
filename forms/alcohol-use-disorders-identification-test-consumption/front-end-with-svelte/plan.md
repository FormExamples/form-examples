# Plan: AUDIT-C — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit front-end mirroring the gold
`quick-sequential-organ-failure-assessment` consolidation.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`):
      `auditc-rules.ts`, `auditc-grader.ts`, `flagged-issues.ts`, `utils.ts`,
      `types.ts`
- [x] Vitest tests covering the 4/5 positive cut, band boundaries (5, 8, 11),
      the sex-specific female cut, and totals 0 and 12
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Six wizard step components (three item steps use numeric `bind:group`
      radios) + live per-item point pills and running total
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
