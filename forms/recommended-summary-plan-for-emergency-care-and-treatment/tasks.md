# Recommended Summary Plan for Emergency Care and Treatment (ReSPECT) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, sections captured, completeness and
      validity model, assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, validation algorithm, flagged issues,
      I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, validation engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (plan table, eight section groups, UUIDv4 PK,
      timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Validation engine (`types.ts`, `utils.ts`, `validation-rules.ts`,
      `plan-validator.ts`, `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard; `/plans/` + `/plans/[id]`).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form recommended-summary-plan-for-emergency-care-and-treatment`
      passes.
