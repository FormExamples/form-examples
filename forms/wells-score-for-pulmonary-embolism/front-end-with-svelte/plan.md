# Wells PE — SvelteKit front-end plan

## Status: built

Greenfield SvelteKit front-end for the Wells Score for PE, mirroring the
consolidated gold-standard pattern (form wizard + SVAR dashboard + PDF report)
and its sibling `wells-score-for-deep-vein-thrombosis/front-end-with-svelte/`.

## Done

- [x] Pure scoring engine ported from the HTML front-end into TypeScript:
  `engine/{types,utils,wells-pe-rules,wells-pe-grader,flagged-issues}.ts`.
- [x] Vitest suite `engine/wells-pe-grader.test.ts` — heart-rate boundary
  (100 vs 101), two-level boundary (4 vs 4.5), three-level boundaries (1.5/2 and
  6/6.5), the 0 and 12.5 extremes, plus flag detection and priority sort.
- [x] Id-keyed Svelte 5 store with `deepAssign` deep-merge and localStorage key
  `wells-score-for-pulmonary-embolism.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (six steps) and `config/themes.ts` (Lily themes).
- [x] Step components `Step1Context` … `Step6Summary` (Lily UI contract): a
  numeric heart-rate input on step 5 and a haemodynamic-status radio on step 3.
- [x] Routes under `/wells-score-for-pulmonary-embolisms/`: welcome, dashboard
  (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`.
- [x] `data/sample-reports.ts` — four samples spanning PE unlikely/likely (incl.
  a haemodynamically-unstable high-probability case) with engine-derived rows.
- [x] `report/pdf-builder.ts` — pdfmake document (criteria table + flags).

## Verify

```sh
pnpm install
pnpm run check       # 0 errors / 0 warnings
pnpm run build
pnpm exec vitest run
```
