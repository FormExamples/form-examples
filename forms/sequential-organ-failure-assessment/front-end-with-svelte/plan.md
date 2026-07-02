# SOFA SvelteKit front-end — plan and status

Consolidated `front-end-with-svelte/` for the Sequential Organ Failure
Assessment (SOFA) score: a single-page wizard, a SVAR clinician dashboard, and a
shared pure scoring engine.

## Status: complete

- [x] Scoring engine ported from the HTML front-end
      (`front-end-with-html/js/{types,rules,grader,flags}.js`) into TypeScript:
      `types.ts`, `utils.ts`, `sofa-rules.ts`, `sofa-grader.ts`,
      `flagged-issues.ts`.
- [x] Vitest coverage: per-system threshold boundaries, totals, delta-SOFA,
      mortality bands, Sepsis-3, and flagged issues (`sofa-grader.test.ts`).
- [x] Id-keyed Svelte 5 store with localStorage persistence and in-place
      `deepAssign` deep-merge (`assessment.svelte.ts`).
- [x] Nine wizard step components (context, baseline, respiration, coagulation,
      liver, cardiovascular, CNS, renal, summary), each showing the live
      per-system sub-score.
- [x] RESTful routes under `sequential-organ-failure-assessments/`: SVAR
      dashboard (`ssr = false`), `[id]` wizard, `[id]/report`, and the
      `[id]/report/pdf` server endpoint.
- [x] Welcome page and themed layout (Lily light default; swappable themes).
- [x] Four sample records spanning the mortality bands (low → extreme) plus
      engine-derived dashboard rows.
- [x] Full Lily token migration — no hardcoded palette classes.
- [x] `pnpm run check`, `pnpm run build`, and `pnpm exec vitest run` all green.

## Notes

- Cardiovascular and renal sub-scores take the maximum band across their two
  criteria; respiration sub-scores 3-4 require respiratory support (else capped
  at 2). A missing input yields a `null` sub-score and marks the assessment
  incomplete — the engine never guesses.
- The dashboard columns (total SOFA, delta-SOFA, mortality band, Sepsis-3, flag
  count) are all produced by running the shared engine over each sample so the
  dashboard and report never drift.
