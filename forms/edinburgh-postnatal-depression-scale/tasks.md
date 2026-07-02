# Edinburgh Postnatal Depression Scale (EPDS) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, scoring system, item table, assessment
      steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, grading algorithm with reverse
      scoring, flagged issues incl. item-10 safety rule, I/O shapes, acceptance
      criteria).
- [x] Author `AGENTS.md` (directory map, scoring engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (assessment table, ten item-score columns,
      UUIDv4 PK, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Scoring engine (`types.ts`, `utils.ts`, `epds-rules.ts`,
      `epds-grader.ts`, `flagged-issues.ts`) + Vitest tests (reverse-score
      mapping, band boundaries 9/10 and 12/13, 0–30 range, item-10 safety flag).
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form edinburgh-postnatal-depression-scale` passes.
