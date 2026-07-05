# Neurodiversity Adjustment Response — tasks

## Done

- [x] Author `index.md` (domain overview, response semantics, four-axis scoring,
      wizard steps, flags).
- [x] Author `AGENTS.md`, `plan.md`, `tasks.md`.
- [x] SQL migrations: `worker`, `manager`, `neurodiversity_adjustment_response`,
      `neurodiversity_adjustment_response_grade`, `..._grade_rule`, `..._grade_flag`.
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
- Response semantics: retrospective decision + confirmation + review, not a
  triage. Source-of-truth table is `neurodiversity_adjustment_response`.
- The `discrimination-risk` flag is the highest-value output: a decline for a
  likely-covered worker without justification or alternatives.
- Pairs with [`neurodiversity-adjustment-request`](../neurodiversity-adjustment-request).
