# Plan: United Kingdom Birth Registration — SvelteKit front-end (form + dashboard)

## Status: complete

SvelteKit front-end whose engine is ported from this form's HTML front-end
(`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `rules.ts`, `grader.ts`,
      `flagged-issues.ts`.
- [x] `grader.test.ts`: replays every persona in `../examples/personas.json`
      (HTML and TypeScript engines must agree) plus focused unit tests for the
      42-day boundary, qualified informants, second-parent routes, and identity.
- [x] Store (`assessment.svelte.ts`): id-keyed, `deepAssign`, localStorage key
      `united-kingdom-birth-registration.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (5 steps), step components `Step1Child` to
      `Step5Certificate`.
- [x] `data/sample-reports.ts`: eight samples drawn from the personas, covering
      all four readiness classes.
- [x] Routes: welcome, layout, dashboard (SVAR + `ssr = false`), `[id]` wizard,
      `[id]/report`, `[id]/report/pdf` server endpoint.
- [x] `report/pdf-builder.ts`: `pdfmake` readiness report.
- [x] `pnpm run check` / `vitest run` / `lint` / `format:check` green.
