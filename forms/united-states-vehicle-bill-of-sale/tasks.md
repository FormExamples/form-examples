# United States Vehicle Bill of Sale — tasks

## Done

- [x] Spec and research (`spec/index.md`, `doc/index.md`)
- [x] SQL migrations in `sql/`
- [x] Generated XML, FHIR R5, protobuf, OpenAPI representations
- [x] HTML front-end (`front-end-with-html/`): wizard, dashboard, engine
- [x] SvelteKit front-end (`front-end-with-svelte/`): engine port, steps, report, dashboard
- [x] Axum back-end (`back-end-with-axum/`)
- [x] Personas (`examples/personas.json`), 12 covering all three classes
- [x] Unit tests: vitest (31), `cargo test` (19)

## To do

- [ ] Re-verify `secondary` state rows (NY, FL, IL, OH, LA) with the agencies
- [ ] Extend `STATE_RULES` beyond nine states
- [ ] Decide whether to model dealer sales
