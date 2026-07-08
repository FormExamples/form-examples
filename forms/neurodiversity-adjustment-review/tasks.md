# Neurodiversity Adjustment Review — tasks

## Done

- [x] SQL migrations: worker, manager, `neurodiversity_adjustment_review`,
      `_grade`, `_grade_rule`, `_grade_flag`; applies cleanly (`bin/test-sql-apply`).
- [x] `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`, `spec/index.md`.
- [x] Generated derivatives (XML, FHIR R5, protobuf, OpenAPI, Loco setup,
      examples, CHANGELOG, llms.txt).

- [x] Build `front-end-with-html` (single-page wizard + dashboard + JS engine).
- [x] Build `front-end-with-svelte` (RESTful list + form routes + TS engine).
- [x] Build `back-end-with-loco` (Rust JSON API crate; relational per-table schema).

## Next

- [ ] Nothing outstanding — form is complete across all stacks. Completes the
      ACAS neurodiversity-adjustment trilogy (request / response / review).

## Notes

- Completes the ACAS trilogy with the request/response pair.
- The `adjustments-not-working` flag (F-ADJUSTMENTS-NOT-WORKING-001) is the key
  output — a failing agreed adjustment.
