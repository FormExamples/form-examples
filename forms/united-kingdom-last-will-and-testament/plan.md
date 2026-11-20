# United Kingdom Last Will and Testament — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-11-20: foundation docs and legal reference; SQL
plus generated representations (XML, FHIR R5, protobuf, OpenAPI, Axum setup);
both consolidated front-ends; the Axum JSON-API crate; `CHANGELOG.md`,
`examples/`, and eleven personas.

## Roadmap

1. **Foundation docs** — `index.md`, `spec/index.md`, `AGENTS.md`, `doc/`. ✅
2. **SQL migrations** — `testator`, the will table (testator, estate, executors,
   four beneficiary slots, family, execution and two witness slots), and the
   grade / grade_rule / grade_flag triad. ✅
3. **Generated representations** — XML, FHIR R5, protobuf, OpenAPI, Axum setup. ✅
4. **Validation engine** — HTML (`types.js`, `rules.js`, `grader.js`,
   `flags.js`) and Svelte (`will-rules.ts`, `will-grader.ts`,
   `flagged-issues.ts`) with Vitest tests and the persona oracle. ✅
5. **Front-ends** — `front-end-with-html` and `front-end-with-svelte`. ✅
6. **Back-end** — `back-end-with-axum`, one route per SQL table. ✅
7. **Verify** — `bin/test-form`, personas, engines, examples conformance, e2e. ✅

## Design notes

- The engine classifies; it does not score. `formality-risk` beats
  `incomplete`.
- Witness checks only bite for a will recorded as `signed`; a witness who is a
  beneficiary is flagged at once.
- Slots are flat columns rather than child tables, to keep one wizard and one
  record; a will with more than four beneficiaries needs a solicitor anyway.
- The wizard has seven steps but must remain one continuous single-page wizard.
- Deferred: privileged wills; Scottish and Northern Irish law; tax arithmetic;
  codicil tracking.
