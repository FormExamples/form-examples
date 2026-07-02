# Plan: Centor Score for Streptococcal Pharyngitis — SvelteKit front-end (form + dashboard)

## Current status

Complete, greenfield consolidated `front-end-with-svelte/`, mirroring the
gold-standard qSOFA front-end. `pnpm run check`, `pnpm run build`, and
`pnpm exec vitest run` all pass.

## Done

- Pure scoring engine ported from the HTML front-end (`js/{types,rules,grader,flags}.js`)
  to TypeScript in `src/lib/engine/`:
  `types.ts`, `utils.ts`, `centor-rules.ts`, `centor-grader.ts`, `flagged-issues.ts`.
- `centor-grader.test.ts` covers the fever boundary (38.0/38.1 °C), each
  age-modifier band boundary (2/3, 14/15, 44/45 years), the Centor total 0–4,
  the full McIsaac range −1 to 5, and each flagged issue.
- Id-keyed Svelte 5 store (`assessment.svelte.ts`) with in-place `deepAssign`
  deep-merge, `createDefaultAssessment()`, and localStorage key
  `centor-score-for-streptococcal-pharyngitis.front-end-with-svelte.<id>.v1`.
- Eight-step wizard: Context, Identification, Tonsillar exudate, Cervical
  lymphadenopathy, Fever, Cough, Red-flag review, Summary.
- SVAR DataGrid dashboard (`ssr = false`) with care-setting and risk-band
  filters; columns for Centor total, McIsaac score, risk band, and airway red flag.
- Report view + `pdfmake` PDF endpoint.
- Full Lily token styling; `Form.svelte` carries `novalidate`.

## Follow-ups

- Wire the dashboard and report to the Loco JSON API when the back-end lands
  (currently seeded from `sample-reports.ts`).
