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

## To do

- [ ] SQL migrations in `sql/` (screening table, right/left eye grading blocks,
      UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Grading engine (`types.ts`, `utils.ts`, `des-rules.ts`, `des-grader.ts`,
      `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form diabetic-eye-screening` passes.
- [ ] Lily HTML / Svelte drift checks pass.
