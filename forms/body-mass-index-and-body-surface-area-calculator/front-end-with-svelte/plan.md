# Plan: Body Mass Index and Body Surface Area Calculator — SvelteKit front-end (form + dashboard)

## Current status

Complete. Greenfield SvelteKit consolidation, mirroring the completed
`corrected-calcium-calculator` front-end (formula calculator).

- [x] Pure calculation engine ported from the HTML front-end (`src/lib/engine/`):
      `types.ts`, `utils.ts`, `bmi-bsa-rules.ts`, `bmi-bsa-grader.ts`,
      `flagged-issues.ts`
- [x] Vitest tests covering the BMI/BSA formulae, the WHO band boundaries
      (18.5 / 25 / 30 / 35 / 40), the Asian action points (23 / 27.5), the
      severe-obesity and underweight flags, and the missing-input path
- [x] id-keyed Svelte 5 store with in-place `deepAssign` + localStorage
- [x] Five wizard step components + live BMI / WHO category / BSA readout
- [x] Welcome page, wizard, report, and PDF endpoint routes
- [x] SVAR DataGrid dashboard (`ssr = false`), engine-derived rows
- [x] Lily token theming; `static/themes/` vendored
- [x] `pnpm check` / `pnpm build` / `vitest run` green

## Future work

- Wire the dashboard to the live back-end API (currently sample data only).
