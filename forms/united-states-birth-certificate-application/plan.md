# United States Birth Certificate Application: plan

Roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-11-20: foundation docs, SQL and generated representations, the classification engine in both front-ends, the Axum JSON API, `CHANGELOG.md`, `examples/` with 13 personas.

## Roadmap

1. **Research and spec**: CDC/NCHS, Model State Vital Statistics Act, eight state rules, passport and apostille rules (`doc/index.md`). Done.
2. **SQL**: `applicant`, `registrant`, application table, grade triad. Done.
3. **Generated representations**: XML, FHIR R5, protobuf, OpenAPI, Axum setup. Done.
4. **Engine**: HTML `rules.js` / `grader.js` / `flags.js`; Svelte `birth-rules.ts` / `birth-grader.ts` / `flagged-issues.ts` with Vitest. Done.
5. **Front-ends**: HTML wizard and dashboard; SvelteKit wizard and dashboard (`/united-states-birth-certificate-application/`). Done.
6. **Back end**: Axum crate on the fleet standard. Done.
7. **Later**: more states (each needs a verified source), a corrections / amendments companion form, FHIR persona bundles.
