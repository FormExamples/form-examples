# United States Social Security Card Application (Form SS-5) - plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Built: foundation docs, SQL, generated representations, the HTML and Svelte
front-ends, the Axum back-end, examples and personas.

## Roadmap

1. **Foundation docs** - index, spec, doc, agent instructions.
2. **SQL migrations** - `patient`, `clinician`, `ss5_application`, and the grade, rule, and flag tables.
3. **Generated representations** - XML, FHIR R5, protobuf, OpenAPI, Axum setup.
4. **Engine** - HTML `rules.js` / `grader.js` / `flags.js` and the Svelte port with Vitest tests.
5. **Front-ends** - HTML wizard and dashboard; SvelteKit wizard and dashboard.
6. **Back-end** - Axum JSON API, relational per-table schema.
7. **Verify** - `bin/test-form`, personas, engines, examples conformance, e2e.

## Design notes

- Classification, not a score; not-eligible takes precedence.
- The Social Security number is never stored.
- Evidence document lists still to be re-verified against the current SS-5 PDF.
