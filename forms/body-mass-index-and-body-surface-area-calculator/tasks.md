# Body Mass Index and Body Surface Area Calculator — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, calculation and classification,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, calculation algorithm and BMI banding,
      flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, calculation engine shape and files,
      conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (assessment table, `height_cm`, `weight_kg`,
      `ancestry`, UUIDv4 PK, timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Calculation engine (`types.ts`, `utils.ts`, `anthropometry-rules.ts`,
      `anthropometry-calculator.ts`, `flagged-issues.ts`) + Vitest tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form body-mass-index-and-body-surface-area-calculator` passes.
- [ ] Lily HTML / Svelte drift checks pass.
