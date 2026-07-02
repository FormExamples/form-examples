# Ottawa Ankle Rules — SvelteKit front-end plan

## Status: built

Greenfield SvelteKit front-end for the Ottawa Ankle Rules (and Ottawa Foot
Rules), mirroring the consolidated gold-standard pattern (form wizard + SVAR
dashboard + PDF report).

## Done

- [x] Pure decision engine ported from the HTML front-end into TypeScript:
  `engine/{types,utils,ottawa-ankle-rules,ottawa-ankle-grader,flagged-issues}.ts`.
  Boolean AND/OR two-region rule (no summation, no risk band).
- [x] Vitest suite `engine/ottawa-ankle-grader.test.ts` — each ankle criterion
  (A1/A2/A3) and foot criterion (F1/F2/F3) in isolation, the zone-pain
  precondition gating, the `unableToBearWeight` truth table, the A3/F3 collapse,
  and the four decision combinations (ankle / foot / both / neither), plus flag
  detection and priority sort. Uses a local `createDefaultAssessment` fixture so
  the tests never import the store.
- [x] Id-keyed Svelte 5 store with `deepAssign` deep-merge and localStorage key
  `ottawa-ankle-rules.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (eight steps) and `config/themes.ts` (Lily themes).
- [x] Step components `Step1Context` … `Step8Summary` (Lily UI contract), with
  live ankle / foot / weight-bearing readouts via a generic `Badge`.
- [x] Routes under `/ottawa-ankle-ruleses/`: welcome, dashboard (`ssr = false`),
  `[id]` wizard, `[id]/report`, `[id]/report/pdf`.
- [x] `data/sample-reports.ts` — four samples spanning ankle-only, foot-only,
  both, and neither, with engine-derived dashboard rows.
- [x] `report/pdf-builder.ts` — pdfmake document (criteria table + flags,
  decisions not a score).

## Verify

```sh
pnpm install
pnpm run check       # 0 errors / 0 warnings
pnpm run build
pnpm exec vitest run
```
