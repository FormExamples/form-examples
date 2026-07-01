# Glasgow-Blatchford Bleeding Score (GBS) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, scoring system, assessment steps,
      conventions, compliance, references).
- [x] Author `spec/index.md` (data model, weighted scoring algorithm, flagged
      issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, scoring engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (assessment table with `sex` + eight parameters,
      UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Scoring engine (`types.ts`, `utils.ts`, `gbs-rules.ts`, `gbs-grader.ts`,
      `flagged-issues.ts`) + Vitest tests covering band boundaries and totals
      0 and 23.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form glasgow-blatchford-bleeding-score` passes.
- [ ] Lily HTML / Svelte drift checks pass.
