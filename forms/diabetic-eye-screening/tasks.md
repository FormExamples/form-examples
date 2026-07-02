# Diabetic Eye Screening record — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, data captured & classification model,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model per eye, grading / outcome algorithm,
      flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, grading engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (screening table, right/left eye grading blocks,
      UUIDv4 PK, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Grading engine (`types.ts`, `utils.ts`, `des-rules.ts`, `des-grader.ts`,
      `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks pass.
- [x] Scaffolded `CHANGELOG.md` and `examples/`.

## To do

- [ ] `bin/test-form diabetic-eye-screening` passes.
