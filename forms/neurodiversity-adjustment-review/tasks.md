# Neurodiversity Adjustment Review — tasks

## Done

- [x] SQL migrations: worker, manager, `neurodiversity_adjustment_review`,
      `_grade`, `_grade_rule`, `_grade_flag`; applies cleanly (`bin/test-sql-apply`).
- [x] `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`, `spec/index.md`.
- [x] Generated derivatives (XML, FHIR R5, protobuf, OpenAPI, Loco setup,
      examples, CHANGELOG, llms.txt).

## Next

- [ ] Build `front-end-with-html` (single-page wizard + dashboard + JS engine).
- [ ] Build `front-end-with-svelte` (RESTful list + form routes + TS engine).
- [ ] Build `back-end-with-loco` (Rust JSON API crate; relational per-table schema).

## Notes

- Completes the ACAS trilogy with the request/response pair.
- The `adjustments-not-working` flag (F-ADJUSTMENTS-NOT-WORKING-001) is the key
  output — a failing agreed adjustment.
