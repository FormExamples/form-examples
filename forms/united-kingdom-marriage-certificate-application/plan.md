# United Kingdom Marriage Certificate Application — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-11-20: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`, `doc/index.md`); SQL
migrations plus generated representations (XML, FHIR R5, protobuf, OpenAPI,
Axum setup); both front-ends (`front-end-with-html` and
`front-end-with-svelte`); the Axum JSON-API back-end; and `CHANGELOG.md` +
`examples/` with seven personas.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions, GOV.UK / GRO sources. ✅
2. **SQL migrations** — `applicant`, `registrar`, the main application table,
   and the `_grade` / `_grade_rule` / `_grade_flag` triad in `sql/`; UUIDv4 PKs,
   timestamps, CHECKs. Source of truth. ✅
3. **Generated representations** — XML, FHIR R5, protobuf, OpenAPI, Axum setup. ✅
4. **Validation engine** — HTML (`types.js`, `rules.js`, `grader.js`,
   `flags.js`) and Svelte (`types.ts`, `utils.ts`, `marriage-rules.ts`,
   `marriage-grader.ts`, `flagged-issues.ts`) with Vitest tests and persona
   parity. ✅
5. **Front-ends** — `front-end-with-html` (Lily wizard + dashboard) and
   `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`). ✅
6. **Back-end** — Rust axum + axa + sqlx JSON API at current fleet standard. ✅
7. **Verification** — `bin/test-form`, `bin/test-personas`, `bin/test-engines`,
   `bin/test-examples-conformance`, `bin/test-e2e --html`. ✅

## Later

- Scotland and Northern Ireland variants (different notice rules).
- Anglican banns and licences, Quaker and Jewish ceremonies.
- Fee calculation from the register office's published fees.
