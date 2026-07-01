# Child Safeguarding Referral — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, sections/data captured, completeness &
      urgency model, assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, validation/urgency algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, grading engine shape and files,
      safeguarding flags, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (referral table(s), UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Grading engine (`types.ts`, `utils.ts`, `safeguarding-rules.ts`,
      `referral-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form child-safeguarding-referral` passes.
- [ ] Lily HTML / Svelte drift checks pass.
