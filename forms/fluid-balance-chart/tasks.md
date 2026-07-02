# Fluid Balance Chart — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, data captured, computation & flag model,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model, computation algorithm, flagged issues,
      I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, computation engine shape and files,
      flagged issues, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (chart header + `fluid_balance_entry` line-item
      table, UUIDv4 PKs, timestamps).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] Computation engine (`types.ts`, `utils.ts`, `balance-rules.ts`,
      `balance-grader.ts`, `flagged-issues.ts`) + Vitest tests.
- [x] `front-end-with-html` (Lily wizard + dashboard).
- [x] `front-end-with-svelte` (Lily wizard + dashboard).
- [x] `back-end-with-loco` (Rust axum + Loco JSON API).
- [x] Lily HTML / Svelte drift checks passed.
</content>

## To do

- [ ] `bin/test-form fluid-balance-chart` passes.
