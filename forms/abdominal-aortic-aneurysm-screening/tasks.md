# Abdominal Aortic Aneurysm (AAA) Screening — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, data captured & classification model,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, diameter-threshold algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, classification engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (screening-scan table, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Classification engine (`types.ts`, `utils.ts`, `aaa-rules.ts`,
      `aaa-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form abdominal-aortic-aneurysm-screening` passes.
- [ ] Lily HTML / Svelte drift checks pass.
