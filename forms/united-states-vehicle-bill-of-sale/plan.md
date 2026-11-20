# United States Vehicle Bill of Sale — plan

Implementation plan and status for the United States vehicle bill-of-sale form.

## Status

Foundation through full stack built: spec, SQL, generated representations,
HTML and SvelteKit front-ends, the Axum crate, personas, and tests.

## Roadmap

- [x] Spec (`spec/index.md`) and research (`doc/index.md`).
- [x] SQL migrations (`sql/`): seller, buyer, bill of sale, grade triad.
- [x] Generated representations: XML, FHIR R5, protobuf, OpenAPI.
- [x] HTML front-end: wizard, dashboard, engine (`rules.js`, `grader.js`, `flags.js`).
- [x] SvelteKit front-end: engine port with vitest tests, seven step components.
- [x] Axum crate with relational per-table API; `cargo test` green.
- [x] `examples/personas.json` covering every class and flag category.
- [ ] Re-verify every `STATE_RULES` row marked `secondary` against its agency.
- [ ] Add more states (the engine falls back to the uniform default).
- [ ] Dealer sales and electronic-title workflows (out of scope today).

## Design notes

- Risk beats incomplete: a complete-looking sale with a lien or a discrepancy is
  still risky.
- Deadline flags read the clock; `bin/test-personas` freezes it.
