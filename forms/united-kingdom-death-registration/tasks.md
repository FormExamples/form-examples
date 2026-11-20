# United Kingdom death registration (England and Wales) — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Research GOV.UK Register a death, Order a copy of a certificate, coroner and
      Tell Us Once guidance; record sources in `doc/index.md`.
- [x] Author `index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`.
- [x] Author `sql/` migrations (UUID PKs, CHECKs, COMMENTs) and apply them on a scratch
      database (`bin/test-sql-apply`).
- [x] Run the XML, FHIR R5, protobuf and OpenAPI generators.
- [x] Build the HTML engine (`js/rules.js`, `js/grader.js`, `js/flags.js`), wizard and
      dashboard.
- [x] Port the engine to TypeScript with vitest tests; build the SvelteKit wizard,
      report and dashboard.
- [x] Build the Axum crate; every fleet `bin/axum-*` check clean; `cargo test` green.
- [x] Author `examples/personas.json` (nine personas covering every class and flag).

## To do

- [ ] Add a mutation-testing baseline row.
- [ ] Decide whether to add a partial unique index on the NHS number for live rows.
