# Partogram (Partograph) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, data captured, progress / flag model,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, progress algorithm, flagged issues,
      I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, progress / flag engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (labour header table + child observation table,
      UUIDv4 PKs and FK, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Progress / flag engine (`types.ts`, `utils.ts`, `partogram-rules.ts`,
      `partogram-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form partogram` passes.
