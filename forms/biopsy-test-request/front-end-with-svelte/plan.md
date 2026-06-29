# Plan: Biopsy Test Request — consolidated front-end (SvelteKit)

## Current status

Complete. Single consolidated `front-end-with-svelte/`: welcome page, themed
layout (45 Lily themes), eight-section wizard, SVAR DataGrid vetting dashboard,
id-based report + server-rendered PDF, and a pure four-axis grading engine ported
from the HTML reference engine with Vitest coverage.

## Structure

- Engine: `src/lib/engine/{defaults,types,rules,flags,grader,utils}.ts` +
  `grader.test.ts` (`calculateGrade`).
- Store: `src/lib/stores/request.svelte.ts` (export `request`), id-keyed.
- Routes: `/biopsy-test-requests/` (dashboard, `ssr = false`),
  `/biopsy-test-requests/[id]` (wizard), `[id]/report`, `[id]/report/pdf`.
- Sample data: `src/lib/data/sample-reports.ts` (4 records spanning the grade
  range; engine-derived dashboard rows).

## Verify

```sh
pnpm install --prefer-offline
pnpm run check     # 0 errors, 0 warnings
pnpm run build     # succeeds (SVAR SSR-safe via ssr = false)
pnpm exec vitest run
```
