# Plan: Fluid Balance Chart — SvelteKit front-end (form + dashboard)

## Goal

A consolidated gold-standard `front-end-with-svelte/` for the Fluid Balance
Chart: one continuous single-page wizard + a SVAR dashboard, Lily Design System
Svelte headless, a pure reconciliation engine, and a `pdfmake` report — with
`pnpm run check`, `pnpm run build`, and `pnpm exec vitest run` all green.

## Status: complete

- [x] Engine ported from the HTML front-end (`js/{types,rules,grader,flags}.js`)
      to `src/lib/engine/{types,utils,fluid-balance-rules,fluid-balance-grader,flagged-issues}.ts`.
      Intake and output modelled as two arrays on the store data.
- [x] Id-keyed store (`assessment.svelte.ts`) with in-place `deepAssign`,
      `createDefaultAssessment()` (arrays initialised), `createDefaultEntry()`,
      and the localStorage key `fluid-balance-chart.front-end-with-svelte.<id>.v1`.
- [x] Five step components; steps 3 and 4 are add/remove repeating-row editors
      for the intake and output child lists, with a live balance readout.
- [x] Routes under `src/routes/fluid-balance-charts/`: dashboard (`ssr = false`),
      `[id]` wizard, report, and `report/pdf` endpoint; plus welcome + layout.
- [x] `sample-reports.ts` — 4 sample charts (balanced / positive / negative /
      oliguria) with populated intake/output arrays + engine-derived rows.
- [x] Vitest engine tests (`fluid-balance-grader.test.ts`) with a local
      `createDefaultChart` fixture (no store import).
- [x] Lily token migration; `Form.svelte` carries `novalidate`.

## Verify

```sh
pnpm install --prefer-offline
pnpm run check
pnpm run build
pnpm exec vitest run
```
