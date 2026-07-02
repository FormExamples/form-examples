# Caprini VTE — SvelteKit front-end plan

## Status: complete

Greenfield SvelteKit front-end mirroring the gold-standard consolidated pattern
(single wizard + SVAR dashboard, one shared engine).

## Done

- Pure scoring engine ported from `front-end-with-html/js/` to TypeScript:
  `types.ts`, `utils.ts`, `caprini-rules.ts` (36 weighted factor rules),
  `caprini-grader.ts` (age band + additive scoring, band mapping, bleeding-risk
  downgrade), `flagged-issues.ts` (5 red-flag rules).
- Vitest suite (`caprini-grader.test.ts`) with a local fixture: band boundaries
  (1/2, 4/5), age-band weights, bleeding downgrade, fired-factor mix, flags.
- Id-keyed Svelte 5 store with localStorage persistence and `deepAssign`.
- Eight `StepNName.svelte` wizard sections; live subtotals per weight group.
- RESTful routes under `/caprini-venous-thromboembolism-risk-assessments/`:
  dashboard (`ssr = false`), `[id]` wizard, report, and `report/pdf` endpoint.
- Sample data: four records spanning very-low / low / moderate / high bands,
  with engine-derived dashboard rows.
- PDF report via `pdfmake`.
- Lily Design System Svelte headless UI components + full theme set.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
