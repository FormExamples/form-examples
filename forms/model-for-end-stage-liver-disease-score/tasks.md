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

## To do

- [ ] SQL migrations in `sql/` (assessment table, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Calculation engine (`types.ts`, `utils.ts`, `meld-rules.ts`,
      `meld-calculator.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form model-for-end-stage-liver-disease-score` passes.
- [ ] Lily HTML / Svelte drift checks pass.
