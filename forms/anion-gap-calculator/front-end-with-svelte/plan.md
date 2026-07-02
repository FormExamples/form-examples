# Anion Gap Calculator — SvelteKit front-end plan

## Status: complete

Consolidated SvelteKit app (wizard + dashboard) built to the gold-standard
RESTful layout, mirroring `forms/corrected-calcium-calculator/front-end-with-svelte/`.

## Done

- [x] Pure calculation engine ported from the HTML front-end
      (`js/{types,rules,grader,flags}.js`) to TypeScript:
      `engine/{types,utils,anion-gap-rules,anion-gap-grader,flagged-issues}.ts`.
- [x] Vitest suite (`anion-gap-grader.test.ts`) covering both formulae, the
      albumin correction, each classification boundary (7/8, 12/13, 16, 19/20),
      the hypoalbuminaemia-masking case, and flag detection. Uses a local
      `createDefaultAssessment` fixture (no store import).
- [x] id-keyed Svelte 5 store with localStorage persistence
      (`anion-gap-calculator.front-end-with-svelte.<id>.v1`) and `deepAssign`.
- [x] Five-step wizard (`Step1Context`, `Step2Identification`,
      `Step3Electrolytes`, `Step4SerumAlbumin`, `Step5Result`).
- [x] Welcome page, `+layout.svelte` nav, RESTful routes under
      `anion-gap-calculators/` (dashboard `ssr = false`, `[id]` wizard, report,
      report/pdf endpoint).
- [x] SVAR DataGrid dashboard with care-setting and classification filters and
      engine-derived rows.
- [x] Server-side `pdfmake` report.
- [x] Four sample assessments spanning normal / low / high / very-high.

## Verify

```sh
pnpm install
pnpm run check && pnpm run build && pnpm exec vitest run
```
