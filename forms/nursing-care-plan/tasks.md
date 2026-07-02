# Nursing Care Plan — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, sections and completeness model,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, completeness algorithm, flagged issues,
      I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, completeness engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] Authored SQL migrations in `sql/` (parent plan + problem / goal /
      intervention tables, UUIDv4 PKs, FK links, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Built the completeness engine (`types.ts`, `utils.ts`,
      `validation-rules.ts`, `care-plan-validator.ts`, `flagged-issues.ts`) +
      Vitest tests.
- [x] Built `front-end-with-html` (Lily wizard + dashboard).
- [x] Built `front-end-with-svelte` (Lily wizard + dashboard).
- [x] Built `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form nursing-care-plan` passes.
