# Medication Reconciliation — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, sections captured, completeness & safety
      model, assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model incl. medication line items and
      discrepancies, reconciliation / validation algorithm, flagged issues,
      I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, reconciliation engine shape and files,
      safety flags, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.

## To do

- [ ] SQL migrations in `sql/` (parent `medication_reconciliation` +
      `information_source`, `allergy`, `medication_line_item`, `discrepancy`
      child tables; UUIDv4 PKs; timestamps).
- [ ] Generate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [ ] Reconciliation engine (`types.ts`, `utils.ts`,
      `reconciliation-rules.ts`, `reconciler.ts`, `flagged-issues.ts`) + Vitest
      tests.
- [ ] `front-end-with-html` (Lily wizard + dashboard).
- [ ] `front-end-with-svelte` (Lily wizard + dashboard).
- [ ] `back-end-with-loco` (Rust axum + Loco JSON API).
- [ ] `bin/test-form medication-reconciliation` passes.
- [ ] Lily HTML / Svelte drift checks pass.
