# Plan: Bowel Cancer Screening with FIT — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`corrected-calcium-calculator` threshold-classifier front-end.

- [x] Pure classification engine ported from the HTML front-end
      (`src/lib/engine/`: `types.ts`, `utils.ts`, `bowel-fit-rules.ts`,
      `bowel-fit-grader.ts`, `flagged-issues.ts`)
- [x] Vitest tests covering the threshold boundary (119 / 120 / 121), a custom
      DG56 threshold of 10, each result class (negative / positive / spoilt),
      non-return, incomplete, and the symptomatic-pathway override
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
      (`bowel-cancer-screening-with-faecal-immunochemical-test.front-end-with-svelte.<id>.v1`)
- [x] Seven wizard step components + live result-class readout
- [x] Welcome page, wizard, report, and PDF endpoint routes under
      `/fit-screenings/`
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
