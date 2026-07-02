# Model for End-Stage Liver Disease (MELD) Score — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, calculation & interpretation, assessment
      steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, calculation algorithm incl. dialysis
      rule and bounds, flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, calculation engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] Authored SQL migrations in `sql/` (assessment table, UUIDv4 PK,
      timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Built the calculation engine (`types.ts`, `utils.ts`, `meld-rules.ts`,
      `meld-calculator.ts`, `flagged-issues.ts`) + Vitest tests.
- [x] Built `front-end-with-html` (Lily wizard + dashboard).
- [x] Built `front-end-with-svelte` (Lily wizard + dashboard).
- [x] Built `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.

## To do

- [ ] `bin/test-form model-for-end-stage-liver-disease-score` passes.
