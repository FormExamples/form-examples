# United States Vehicle Title and Registration Application — plan

Implementation roadmap. See [`tasks.md`](./tasks.md) for task status and
[`spec/index.md`](./spec/index.md) for the contract.

## Phases

1. **Spec and research.** `index.md`, `spec/index.md`, `doc/index.md` with the
   federal rules (49 CFR 565.15, Part 580, NMVTIS) and the verified state table.
2. **SQL.** `applicant`, `lienholder`, `vehicle_title_application`, and the
   `_grade` / `_grade_rule` / `_grade_flag` triad, with CHECKs and comments.
3. **Generated representations.** XML, FHIR R5, protobuf, OpenAPI, the Axum
   setup script, `examples/`, `llms.txt`, and the per-form skills.
4. **HTML front-end.** Wizard, dashboard, and the engine in `js/`.
5. **Personas.** `examples/personas.json`, at least six, covering every class.
6. **SvelteKit front-end.** Port of the engine to TypeScript with Vitest tests,
   the wizard steps, and the dashboard.
7. **Axum back-end.** Crate matching the fleet standard, with `cargo test`
   against a scratch Postgres.

## Risks

- State law changes: re-verify `STATE_RULES` each year, and never encode a fee.
- The engine must stay pure; it uses no clock, so personas never rot.
