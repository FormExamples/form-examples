# Cardiopulmonary Resuscitation Training — front-end (SvelteKit)

Consolidated gold-standard SvelteKit front-end for the AHA BLS Skills
Verification Checklist: a single continuous wizard plus an SVAR DataGrid
coordinator dashboard, styled with the Lily Design System (headless) and
graded by a shared pure TypeScript engine.

- RESTful routes: `/cardiopulmonary-resuscitation-trainings/` (dashboard) and
  `/cardiopulmonary-resuscitation-trainings/[id]` (wizard) with
  `[id]/report` and `[id]/report/pdf`.
- Engine: `src/lib/engine/` (`types.ts`, `bls-rules.ts`, `bls-grader.ts`,
  `flagged-issues.ts`, `utils.ts`); Pass / Fail with critical-action criteria.
- Vitest unit tests: `src/lib/engine/bls-grader.test.ts`.

See parent [`../index.md`](../index.md) for the form specification.
