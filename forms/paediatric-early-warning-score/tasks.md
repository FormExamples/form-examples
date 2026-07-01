# Paediatric Early Warning Score (PEWS) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, scoring system with age bands, assessment
      steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model with age-band selection, grading
      algorithm, flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, scoring engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (assessment table with `age_band`, seven parameter
      inputs, two concern flags, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Scoring engine (`types.ts`, `utils.ts`, `pews-rules.ts`, `pews-grader.ts`,
      `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form paediatric-early-warning-score` passes.
- [ ] Lily HTML / Svelte drift checks pass.
