# Mental State Examination (MSE) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, domains and documentation model,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model per domain, completeness and risk
      algorithm, flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, grading engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (assessment schema, UUIDv4 PK, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Grading engine (`types.ts`, `utils.ts`, `mse-rules.ts`, `mse-grader.ts`,
      `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks pass.
- [x] Scaffolded `CHANGELOG.md` and `examples/`.

## To do

- [ ] `bin/test-form mental-state-examination` passes.
