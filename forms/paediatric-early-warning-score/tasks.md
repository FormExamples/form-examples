# Paediatric Early Warning Score (PEWS) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, scoring system with age bands, assessment
      steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model with age-band selection, grading
      algorithm, flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, scoring engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (assessment table with `age_band`, seven parameter
      inputs, two concern flags, UUIDv4 PK, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Scoring engine (`types.ts`, `utils.ts`, `pews-rules.ts`, `pews-grader.ts`,
      `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form paediatric-early-warning-score` passes.
