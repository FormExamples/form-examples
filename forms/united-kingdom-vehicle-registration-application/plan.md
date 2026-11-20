# United Kingdom Vehicle Registration Application — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-11-20: foundation docs and GOV.UK research; SQL
migrations plus generated representations (XML, FHIR R5, protobuf, OpenAPI, Axum
setup); the validation engine in both front-ends with 17 personas; both
consolidated front-ends; the Axum JSON-API back-end; `CHANGELOG.md` and
`examples/`.

## Roadmap

1. **Foundation docs and research** — index, spec, doc, agent instructions. Done.
2. **SQL migrations** — `applicant`, `keeper`, the main application table, and
   the grade, rule, and flag children in `sql/`. Source of truth. Done.
3. **Generated representations** — XML, FHIR R5, protobuf, OpenAPI, Axum setup.
   Done.
4. **Validation engine** — HTML `types.js`, `rules.js`, `grader.js`, `flags.js`;
   Svelte `types.ts`, `vra-rules.ts`, `vra-grader.ts`, `flagged-issues.ts` with
   Vitest tests and a persona replay. Done.
5. **Front-ends** — `front-end-with-html` (Lily wizard + dashboard) and
   `front-end-with-svelte` (RESTful `/<plural>/` list + `/<plural>/[id]` form).
   Done.
6. **Back-end** — `back-end-with-axum` Rust axum + axa JSON API, relational
   per-table schema, brought to fleet standard by the `bin/axum-*` tools. Done.
7. **Verify** — `bin/test-form`, personas, engines, examples conformance, e2e.
   Done.

## Open points

- Re-check the assumptions in [`doc/index.md`](./doc/index.md) against the V62,
  V55/4, V55/5, and V627/1 forms themselves (fees and ID rules change).
- A second revision could add the DVLA Vehicle Enquiry Service and MOT history
  look-ups, and registration to a Northern Ireland address through the DVA.

## Design notes

- The engine classifies; it makes no decision. `incomplete` outranks
  `needs-supporting-documents` so the form is finished before evidence is
  gathered.
- No wall-clock reads: the application date is the reference for every age rule.
