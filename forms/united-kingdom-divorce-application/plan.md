# United Kingdom Divorce Application - plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-11-20: foundation docs, SQL migrations and generated
representations, both front-ends, the Axum JSON-API back-end, `CHANGELOG.md` and
`examples/` including `personas.json`.

## Roadmap

1. **Foundation docs** - index, spec, agent instructions, cited rules in `doc/`.
2. **SQL migrations** - `applicant`, `caseworker`, the application table and the
   `_grade` / `_grade_rule` / `_grade_flag` triad.
3. **Generated representations** - XML, FHIR R5, protobuf, OpenAPI, Axum setup.
4. **Engine** - completeness and time-gate engine with personas and Vitest tests.
5. **Front-ends** - HTML wizard + dashboard; SvelteKit wizard + dashboard.
6. **Back-end** - Axum crate at fleet standard.
