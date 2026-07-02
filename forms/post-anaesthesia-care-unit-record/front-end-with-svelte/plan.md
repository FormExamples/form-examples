# Plan: PACU Record — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation mirroring the qSOFA
front-end pilot and the gold-standard Svelte recipe.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`):
      `types.ts`, `utils.ts`, `pacu-rules.ts`, `pacu-grader.ts`,
      `flagged-issues.ts`
- [x] Vitest tests covering the 8/9 discharge boundary, the SpO2-gated
      discharge case, every Aldrete parameter level, the PADSS >= 9 boundary,
      and each flag
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Ten wizard step components (context, identification, five Aldrete
      parameters, observations, PADSS, summary) + live sub-score pills and
      running Aldrete / PADSS totals
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
