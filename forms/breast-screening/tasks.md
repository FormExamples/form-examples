# Breast Screening Record — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, data captured & result-classification
      model, assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, classification algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, classification engine shape and files,
      result classes and outcomes, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (screening-record table, UUIDv4 PK, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Classification engine (`types.ts`, `utils.ts`, `screening-rules.ts`,
      `screening-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks pass.
- [x] Scaffolded `CHANGELOG.md` and `examples/`.

## To do

- [ ] `bin/test-form breast-screening` passes.
