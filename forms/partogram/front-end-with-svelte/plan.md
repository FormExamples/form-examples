# Plan: Partogram — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield consolidated front-end built from the gold-standard
sibling `anaesthetic-record/front-end-with-svelte/` (repeating timed-row
editor), with the progress engine ported from the HTML front-end
(`front-end-with-html/js/{types,rules,grader,flags}.js`) into TypeScript.

## Done

- Engine ported to `src/lib/engine/`: `types.ts`, `partogram-rules.ts`
  (alert / action reference-line geometry + thresholds), `partogram-grader.ts`
  (`calculateGrade`), `flagged-issues.ts` (threshold flags across the series),
  `utils.ts` (labels + Lily-token colours), and `partogram-grader.test.ts`.
- Id-keyed store with `deepAssign` array-in-place merge and
  `createDefaultObservation()` / `createDefaultAssessment()`.
- 5-step wizard: labour context, patient identification, admission findings, the
  add/remove observation-series editor, and the summary / progress step.
- Sample data: 4 records with populated observation arrays spanning normal,
  alert-line-crossed, and action-line-crossed progress; engine-derived rows.
- Routes under `src/routes/partograms/`: SVAR dashboard (`ssr = false`), wizard,
  report, and PDF endpoint. Welcome page + themed layout.
- PDF report via `pdfmake`.

## Verify

```sh
pnpm install
pnpm run check     # 0 errors, 0 warnings
pnpm run build
pnpm exec vitest run
```
