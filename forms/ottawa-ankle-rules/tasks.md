# Ottawa Ankle Rules (and Ottawa Foot Rules) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, decision rule, assessment steps,
      conventions, compliance, references).
- [x] Author `spec/index.md` (data model, boolean decision algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, decision engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (assessment table, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Decision engine (`types.ts`, `utils.ts`, `ottawa-ankle-rules.ts`,
      `ottawa-ankle-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form ottawa-ankle-rules` passes.
- [ ] Lily HTML / Svelte drift checks pass.
