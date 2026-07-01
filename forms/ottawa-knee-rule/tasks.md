# Ottawa Knee Rule — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, decision-rule system, assessment steps,
      conventions, compliance, references).
- [x] Author `spec/index.md` (data model, decision algorithm, flagged issues,
      I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, decision engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (assessment table, five criterion inputs, UUIDv4
      PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Decision engine (`types.ts`, `utils.ts`, `ottawa-knee-rules.ts`,
      `ottawa-knee-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form ottawa-knee-rule` passes.
- [ ] Lily HTML / Svelte drift checks pass.
