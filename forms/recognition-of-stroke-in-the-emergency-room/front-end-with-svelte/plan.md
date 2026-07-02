# Plan: ROSIER — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`quick-sequential-organ-failure-assessment` front-end (itself the pilot for the
greenfield Svelte recipe) and the gold `cardiology-assessment` front-end.

- [x] Pure scoring engine ported from the HTML front-end (`src/lib/engine/`):
      signed additive -2..+5, strict `> 0` band threshold, hypoglycaemia
      precondition
- [x] Vitest tests covering the `> 0` boundary (0 vs +1), the -2 and +5 extremes,
      and the hypoglycaemia flag at glucose 3.4 / 3.5
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
      (`recognition-of-stroke-in-the-emergency-room.front-end-with-svelte.<id>.v1`)
- [x] Six wizard step components + live per-criterion signed point pills
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
