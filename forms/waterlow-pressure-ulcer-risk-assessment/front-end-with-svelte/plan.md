# Waterlow — SvelteKit front-end plan

## Status: complete

Greenfield SvelteKit front-end mirroring the gold-standard consolidated pattern
(single wizard + SVAR dashboard, one shared engine).

## Done

- Pure scoring engine ported from `front-end-with-html/js/` to TypeScript:
  `types.ts`, `utils.ts`, `waterlow-rules.ts` (per-category point maps + ten
  category definitions), `waterlow-grader.ts` (summed weighted score, band
  mapping, contributing-categories breakdown), `flagged-issues.ts` (six
  red-flag rules).
- Vitest suite (`waterlow-grader.test.ts`) with a local fixture: band
  boundaries (9/10, 14/15, 19/20), every category point map, and all six flags.
- Id-keyed Svelte 5 store with localStorage persistence and `deepAssign`.
- Five `StepNName.svelte` wizard sections; live core / special-risk subtotals.
- RESTful routes under `/waterlow-pressure-ulcer-risk-assessments/`:
  dashboard (`ssr = false`), `[id]` wizard, report, and `report/pdf` endpoint.
- Sample data: four records spanning low / at-risk / high / very-high bands,
  with engine-derived dashboard rows.
- PDF report via `pdfmake`.
- Lily Design System Svelte headless UI components + full theme set.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
