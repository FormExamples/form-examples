# Emergency Department Triage Note — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, triage system & classification model,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, classification algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, classification engine shape and files,
      triage levels & target times, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (triage table, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Classification engine (`types.ts`, `utils.ts`, `triage-rules.ts`,
      `triage-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form emergency-department-triage-note` passes.
- [ ] Lily HTML / Svelte drift checks pass.
