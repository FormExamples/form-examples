# United Kingdom Marriage Certificate Application — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Researched the GOV.UK and GRO rules and recorded them in
      [`doc/index.md`](./doc/index.md).
- [x] Authored `index.md`, `spec/index.md`, `AGENTS.md`, `plan.md` and `tasks.md`.
- [x] Authored SQL migrations in `sql/` (applicant, registrar, application and
      the grade / rule / flag triad).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Axum setup, examples.
- [x] Built the HTML engine (`types.js`, `rules.js`, `grader.js`, `flags.js`).
- [x] Built `front-end-with-html` (Lily wizard + dashboard).
- [x] Built `front-end-with-svelte` (engine port, Vitest tests, wizard +
      dashboard, lint and format).
- [x] Built `back-end-with-axum` (Rust axum + axa JSON API; `cargo test` green).
- [x] Authored `examples/personas.json` (7 personas, all classes and flags).

## To do

- [ ] Scotland and Northern Ireland variants.
- [ ] Fee calculation.
