# Plan: Chronic Kidney Disease Annual Review — SvelteKit front-end (form + dashboard)

## Goal

A consolidated SvelteKit front-end for the CKD annual review: a single-page,
eight-section wizard plus a clinician dashboard, driven by a pure KDIGO
classification-and-completeness engine (no numeric score). Mirrors the gold
standard `hypertension-review` sibling and the Lily Svelte headless contract.

## Status — complete

- [x] Pure engine ported from `front-end-with-html/js` to
      `src/lib/engine/{types,utils,ckd-review-rules,ckd-review-grader,flagged-issues}.ts`.
- [x] G-stage / A-stage / KDIGO heat-map / BP-target / rapid-decline /
      completeness logic with Vitest coverage of every boundary and heat-map cell.
- [x] Id-keyed Svelte 5 store with localStorage persistence
      (`chronic-kidney-disease-review.front-end-with-svelte.<id>.v1`), deep-merge
      rehydration, and `createDefaultAssessment()`.
- [x] Eight `StepNName.svelte` wizard sections using the Lily headless UI set.
- [x] `config/steps.ts` (8 steps) and `data/sample-reports.ts` (4 samples
      spanning G/A stages, all risk zones, and completeness states).
- [x] RESTful routes under `src/routes/chronic-kidney-disease-reviews/`
      (dashboard `ssr = false`, `[id]` wizard, report, `report/pdf`) + welcome.
- [x] `report/pdf-builder.ts` (`pdfmake` — KDIGO classification + completeness).
- [x] `pnpm run check`, `pnpm run build`, and `pnpm exec vitest run` all green.

## Notes

- Documentation-and-classification tool; not a diagnosis and not a prescribing
  instrument. There is no total score.
- The same pure engine drives the wizard's live readout, the report, the PDF,
  and the dashboard rows so all four stay aligned.
