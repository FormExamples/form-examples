# General Practitioner Referral Letter — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, completeness/urgency model, assessment
      steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, completeness/urgency algorithm,
      flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, documentation-engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] Authored SQL migrations in `sql/` (referral table, UUIDv4 PK, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Built the documentation engine (`types.ts`, `utils.ts`,
      `validation-rules.ts`, `referral-validator.ts`, `flagged-issues.ts`) +
      Vitest tests.
- [x] Built `front-end-with-html` (Lily wizard + dashboard).
- [x] Built `front-end-with-svelte` (Lily wizard + dashboard).
- [x] Built `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form general-practitioner-referral-letter` passes.
