# Mental Health Act Assessment — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, sections and statutory criteria,
      completeness / classification model, assessment steps, conventions,
      compliance, references).
- [x] Author `spec/index.md` (data model, validation / classification algorithm,
      flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, engine shape and files, conventions,
      compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (assessment table, UUIDv4 PK, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Validation / classification engine (`types.ts`, `utils.ts`,
      `mha-rules.ts`, `mha-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks pass.
- [x] Scaffolded `CHANGELOG.md` and `examples/`.

## To do

- [ ] `bin/test-form mental-health-act-assessment` passes.
