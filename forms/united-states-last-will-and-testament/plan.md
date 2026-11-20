# United States Last Will and Testament: plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-11-20: foundation docs and research; SQL and the
generated representations; the validation engine in JavaScript and a TypeScript
port; both consolidated front-ends; the Axum JSON-API back-end; `CHANGELOG.md`,
`examples/` and 13 personas.

## Roadmap

1. **Research and spec** (UPC Article II, eight state rules, estate-tax
   thresholds). Done.
2. **SQL migrations**: `testator`, `attorney`, the will, and the grade, rule and
   flag tables. Done.
3. **Generated representations**: XML, FHIR R5, protobuf, OpenAPI, Axum setup. Done.
4. **Validation engine**: `rules.js`, `grader.js`, `flags.js`, `types.js`, and the
   Svelte port with Vitest tests. Done.
5. **Front-ends**: `front-end-with-html` and `front-end-with-svelte`. Done.
6. **Back-end**: the Axum crate to fleet standard. Done.
7. **Personas and gates**: `examples/personas.json`, `bin/test-form`. Done.

## Follow-ups

- Verify the rows in `doc/index.md` marked "Recalled; verify" against the current
  statutes (Illinois 4-6, Pennsylvania 2505, California 6110 to 6112, and the
  electronic-will statutes).
- Add more states to `STATE_RULES`, starting with Arizona, Colorado, Georgia,
  Massachusetts and New Jersey.
- Model the UPC augmented estate and a pretermitted spouse.
