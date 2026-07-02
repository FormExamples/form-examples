# Anaesthetic Record — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, data captured, completeness & safety
      model, assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model with child rows, completeness /
      validation algorithm, safety flags, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, validation engine shape and files,
      status classes, mandatory-item rules, safety flags, conventions,
      compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (parent `anaesthetic_record` + child
      `drug_administration`, `timed_observation`, `intra_operative_event`;
      UUIDv4 PKs, foreign keys, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Completeness / validation engine (`types.ts`, `utils.ts`,
      `validation-rules.ts`, `record-validator.ts`, `flagged-issues.ts`) +
      Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form anaesthetic-record` passes.
