# Apgar Score — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, scoring system, assessment steps,
      conventions, compliance, references).
- [x] Author `spec/index.md` (data model with repeated timepoints, grading
      algorithm, trend, flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, scoring engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (assessment table + per-timepoint score table,
      UUIDv4 PKs, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Scoring engine (`types.ts`, `utils.ts`, `apgar-rules.ts`,
      `apgar-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form apgar-score` passes.
- [ ] Lily HTML / Svelte drift checks pass.
</content>
