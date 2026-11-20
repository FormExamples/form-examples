# Plan: United States Vehicle Bill of Sale — SvelteKit front-end (form + dashboard)

## Status: complete

SvelteKit front-end for the bill-of-sale form. The engine is ported from this
form's HTML front-end (`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): types, utils, defaults, rules, grader, flagged issues.
- [x] Classification: precedence `risk-flagged` > `incomplete` > `complete`.
- [x] 18 flags (`F-BOS-001` to `F-BOS-018`).
- [x] `bill-of-sale-grader.test.ts`: rule tests plus every persona in `examples/personas.json`.
- [x] Store (`assessment.svelte.ts`): id-keyed, `deepAssign`, localStorage key
      `united-states-vehicle-bill-of-sale.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (7 steps), `config/states.ts`, `config/themes.ts`.
- [x] `data/sample-reports.ts`: one sample per persona with engine-derived rows.
- [x] Step components `Step1Transaction` to `Step7AfterSale`.
- [x] Routes: welcome, layout, dashboard (SVAR + `ssr = false`), `[id]` wizard,
      `[id]/report`, `[id]/report/pdf`.
- [x] `pnpm check` / `pnpm build` / `vitest run` / lint / format:check green.
