# Learning Disability Annual Health Check — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, components captured, completeness model &
      Health Action Plan, assessment steps, conventions, compliance,
      references).
- [x] Author `spec/index.md` (data model, completeness algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, completeness engine shape and files,
      STOMP handling, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (annual-health-check table, UUIDv4 PK,
      timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Completeness engine (`types.ts`, `utils.ts`, `review-rules.ts`,
      `review-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks pass.
- [x] Scaffolded `CHANGELOG.md` and `examples/`.

## To do

- [ ] `bin/test-form learning-disability-annual-health-check` passes.
