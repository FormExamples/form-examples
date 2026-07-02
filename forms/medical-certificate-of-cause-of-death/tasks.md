# Medical Certificate of Cause of Death (MCCD) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, sections and validity model, assessment
      steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, validity / referral algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, validation engine shape and files,
      validity classes, flagged issues, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] Authored SQL migrations in `sql/` (certificate table, UUIDv4 PK,
      timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Built the validation engine (`types.ts`, `utils.ts`,
      `validation-rules.ts`, `certificate-validator.ts`, `flagged-issues.ts`) +
      Vitest tests.
- [x] Built `front-end-with-html` (Lily wizard + dashboard).
- [x] Built `front-end-with-svelte` (Lily wizard + dashboard).
- [x] Built `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form medical-certificate-of-cause-of-death` passes.
