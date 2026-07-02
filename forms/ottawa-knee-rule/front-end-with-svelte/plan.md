# Ottawa Knee Rule — SvelteKit front-end plan

## Status: built

Greenfield SvelteKit front-end for the Ottawa Knee Rule, mirroring the
consolidated gold-standard pattern (form wizard + SVAR dashboard + PDF report).

## Done

- [x] Pure decision engine ported from the HTML front-end into TypeScript:
  `engine/{types,utils,ottawa-knee-rules,ottawa-knee-grader,flagged-issues}.ts`.
  ANY-of decision → `xrayIndicated`; isolated-patellar = patellar AND NOT other
  bony tenderness. No numeric score.
- [x] Vitest suite `engine/ottawa-knee-grader.test.ts` — age boundary (54/55),
  each single-criterion trigger in isolation, isolated-vs-non-isolated patellar
  distinction, all-absent negative case, ANY-of multi-criterion case, plus flag
  detection and priority sort. Uses a local `createDefaultAssessment` fixture
  (no store import).
- [x] Id-keyed Svelte 5 store with `deepAssign` deep-merge and localStorage key
  `ottawa-knee-rule.front-end-with-svelte.<id>.v1`.
- [x] `config/steps.ts` (seven steps) and `config/themes.ts` (Lily themes).
- [x] Step components `Step1Context` … `Step7Summary` (Lily UI contract).
- [x] Routes under `/ottawa-knee-rules/`: welcome, dashboard (`ssr = false`),
  `[id]` wizard, `[id]/report`, `[id]/report/pdf`.
- [x] `data/sample-reports.ts` — four samples spanning X-ray indicated / not
  indicated with engine-derived dashboard rows.
- [x] `report/pdf-builder.ts` — pdfmake document (criteria table + flags;
  decision, not a score).

## Verify

```sh
pnpm install
pnpm run check       # 0 errors / 0 warnings
pnpm run build
pnpm exec vitest run
```
