# Ward Round Note — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, sections and completeness model, status
      classes, flagged issues, assessment steps, conventions, compliance,
      references).
- [x] Author `spec/index.md` (data model, completeness algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, completeness engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (note table, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Completeness engine (`types.ts`, `utils.ts`, `validation-rules.ts`,
      `note-validator.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form ward-round-note` passes.
- [ ] Lily HTML / Svelte drift checks pass.
