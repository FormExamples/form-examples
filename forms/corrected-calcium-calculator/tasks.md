# Corrected Calcium Calculator — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, calculation and interpretation,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, calculation algorithm and
      classification, flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, calculation engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (calculation table, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Calculation engine (`types.ts`, `utils.ts`, `calcium-rules.ts`,
      `calcium-calculator.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form corrected-calcium-calculator` passes.
- [ ] Lily HTML / Svelte drift checks pass.
