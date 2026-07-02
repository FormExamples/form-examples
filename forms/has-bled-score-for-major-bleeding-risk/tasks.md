# HAS-BLED Score for Major Bleeding Risk — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, scoring system, assessment steps,
      conventions, compliance, references).
- [x] Author `spec/index.md` (data model, grading algorithm, flagged issues,
      I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, scoring engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (assessment table, nine criterion inputs, UUIDv4
      PK, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup script,
      `CHANGELOG.md`, and `examples/`.
- [x] Scoring engine (`types.ts`, `utils.ts`, `hasbled-rules.ts`,
      `hasbled-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks pass.

## To do

- [ ] `bin/test-form has-bled-score-for-major-bleeding-risk` passes
      (blocked by a repo-wide `bin/test-form` harness issue, not by this form).
