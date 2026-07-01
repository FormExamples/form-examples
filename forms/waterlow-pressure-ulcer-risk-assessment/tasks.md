# Waterlow Pressure Ulcer Risk Assessment — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, scoring system with weighted category and
      special-risk tables, total bands, assessment steps, conventions,
      compliance, references).
- [x] Author `spec/index.md` (data model, weighted grading algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, scoring engine shape and files, flagged
      issues, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (assessment table, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Scoring engine (`types.ts`, `utils.ts`, `waterlow-rules.ts`,
      `waterlow-grader.ts`, `flagged-issues.ts`) + Vitest tests covering band
      boundaries (9/10, 14/15, 19/20).
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form waterlow-pressure-ulcer-risk-assessment` passes.
- [ ] Lily HTML / Svelte drift checks pass.
