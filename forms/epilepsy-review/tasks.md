# Epilepsy Annual Review — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, sections captured, control-classification
      and completeness model, assessment steps, conventions, compliance,
      references).
- [x] Author `spec/index.md` (data model, classification algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, classification engine shape and files,
      flagged issues, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (review table, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Classification engine (`types.ts`, `utils.ts`, `review-rules.ts`,
      `review-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form epilepsy-review` passes.
- [ ] Lily HTML / Svelte drift checks pass.
