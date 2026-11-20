# United Kingdom Vehicle Bill of Sale — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built: foundation docs, SQL and generated representations, both
front-ends, the Axum JSON-API back-end, and `CHANGELOG.md` + `examples/`.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions, `doc/`. Done.
2. **SQL migrations** — `seller`, `buyer`, the bill-of-sale table, and the
   grade / grade_rule / grade_flag triad. Done.
3. **Generated representations** — XML, FHIR R5, protobuf, OpenAPI, Axum setup.
   Done.
4. **Engine** — rules, grader, flags in JavaScript and TypeScript with Vitest
   tests and `examples/personas.json`. Done.
5. **Front-ends** — `front-end-with-html` and `front-end-with-svelte`. Done.
6. **Back-end** — `back-end-with-axum`. Done.
7. **Verify** — `bin/test-form united-kingdom-vehicle-bill-of-sale`.

## Design notes

- The engine classifies; it never decides ownership or legal rights.
- Risk-flagged takes precedence over incomplete.
