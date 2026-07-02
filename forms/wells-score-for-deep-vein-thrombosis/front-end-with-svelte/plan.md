# Wells DVT — SvelteKit front-end plan

## Status: built

Greenfield SvelteKit front-end for the Wells Score for DVT, mirroring the
consolidated gold-standard pattern (form wizard + SVAR dashboard + PDF report).

## Done

- [x] Pure scoring engine ported from the HTML front-end into TypeScript:
  `engine/{types,utils,wells-dvt-rules,wells-dvt-grader,flagged-issues}.ts`.
- [x] Vitest suite `engine/wells-dvt-grader.test.ts` — two-level boundary (1 vs
  2), three-level boundaries (0/1, 2/3), the −2 adjustment (incl. negative), and
  the −2 / 9 extremes, plus flag detection and priority sort.
- [x] Id-keyed Svelte 5 store with `deepAssign` deep-merge and localStorage key
  `wells-score-for-deep-vein-thrombosis.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (six steps) and `config/themes.ts` (Lily themes).
- [x] Step components `Step1Context` … `Step6Summary` (Lily UI contract).
- [x] Routes under `/wells-score-for-deep-vein-thromboses/`: welcome, dashboard
  (`ssr = false`), `[id]` wizard, `[id]/report`, `[id]/report/pdf`.
- [x] `data/sample-reports.ts` — four samples spanning DVT unlikely/likely with
  engine-derived dashboard rows.
- [x] `report/pdf-builder.ts` — pdfmake document (criteria table + flags).

## Verify

```sh
pnpm install
pnpm run check       # 0 errors / 0 warnings
pnpm run build
pnpm exec vitest run
```
