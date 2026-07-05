# Neurodiversity Adjustment Request — tasks

## Done

- [x] Author `index.md` (domain overview, four-axis scoring, wizard steps, flags).
- [x] Author `AGENTS.md`, `plan.md`, `tasks.md`.
- [x] SQL migrations: `worker`, `manager`, `neurodiversity_adjustment_request`,
      `neurodiversity_adjustment_request_grade`, `..._grade_rule`, `..._grade_flag`.
- [x] SQL applies cleanly on a fresh Postgres database (`bin/test-sql-apply`).

## Next

- [ ] Regenerate derived artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup).
- [ ] Generate `spec/index.md`, `CHANGELOG.md`, `examples/`, `llms.txt`.
- [ ] Build `front-end-with-html` (single-page wizard + dashboard + JS engine).
- [ ] Build `front-end-with-svelte` (RESTful list + form routes + TS engine).
- [ ] Build `back-end-with-loco` (Rust JSON API crate; relational per-table schema).
- [ ] Curate example fixtures across the four-axis bands.

## Notes

- Domain is UK workplace / employment, not clinical: `worker` + `manager`
  entities, ACAS + Equality Act 2010 references.
- Neurodivergence details are special category (health) data — handle with
  consent and a lawful basis.
- Pairs with [`neurodiversity-adjustment-response`](../neurodiversity-adjustment-response).
