# Sports Medicine Assessment — front-end (SvelteKit)

Consolidated SvelteKit front-end for the Sports Medicine Assessment
(Pre-Participation Physical Evaluation, PPE 5th ed.): a single-page wizard plus
a clinician dashboard, sharing one pure grading engine.

- RESTful routes: `/sports-medicine-assessments/` (SVAR DataGrid dashboard) and
  `/sports-medicine-assessments/[id]` (ten-section wizard), with
  `[id]/report` and `[id]/report/pdf` for the graded report.
- Engine in `src/lib/engine/` (`types.ts`, `ppe-rules.ts`, `ppe-grader.ts`,
  `flagged-issues.ts`, `utils.ts`) ported from the HTML form's JavaScript engine,
  with Vitest tests in `ppe-grader.test.ts`.
- The engine aggregates the highest-grade fired PPE rule into a single
  clearance decision: Cleared, Cleared with Conditions, Not Cleared Pending
  Further Evaluation, or Not Cleared for Sport.
- Lily Design System (Svelte headless) components in `src/lib/components/ui/`;
  45 Lily themes under `static/themes/`.

See parent [`../index.md`](../index.md) for the form specification.
