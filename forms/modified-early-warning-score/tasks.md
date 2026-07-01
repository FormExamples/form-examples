# Modified Early Warning Score (MEWS) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, scoring system with allocation table,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, grading algorithm, flagged issues,
      I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, scoring engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (observation table, five parameter inputs,
      optional `previous_mews_score`, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Scoring engine (`types.ts`, `utils.ts`, `mews-rules.ts`,
      `mews-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form modified-early-warning-score` passes.
- [ ] Lily HTML / Svelte drift checks pass.
