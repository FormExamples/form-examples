# United Kingdom Birth Registration — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Built 2026-11-20: foundation docs, SQL, generated representations, the HTML and
SvelteKit front-ends with their engines, the Axum crate, personas and examples.

## Roadmap

1. **Research** — GOV.UK Register a birth, Who can register a birth, Proving your
   identity, and Order a copy of a certificate; rules mapped in `doc/index.md`.
2. **Spec** — `spec/index.md`, `index.md`, `AGENTS.md`.
3. **SQL** — application table plus the grade, rule and flag triad.
4. **Generated representations** — XML, FHIR R5, protobuf, OpenAPI, Axum setup.
5. **Engine** — HTML modules and the TypeScript port with Vitest tests.
6. **Front-ends** — wizard and dashboard in HTML and SvelteKit.
7. **Back-end** — Axum JSON API, one route per table.
8. **Personas** — every class and every flag.

## Open questions

- Confirm the 12-month Registrar General rule and the stillbirth rule against
  legislation.gov.uk and the General Register Office.
- Whether to model re-ordering a certificate for an existing entry (GRO index
  reference, search fee).
