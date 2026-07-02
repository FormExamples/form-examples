# Structured Medication Review (SMR) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, sections captured, review and scoring
      model, assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model incl. repeating medicine list, review /
      scoring algorithm with ACB sum, flagged issues, I/O shapes, acceptance
      criteria).
- [x] Author `AGENTS.md` (directory map, scoring engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (review table + one-to-many medicine table,
      UUIDv4 PKs, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Scoring engine (`types.ts`, `utils.ts`, `smr-rules.ts`, `smr-grader.ts`,
      `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form structured-medication-review` passes.
