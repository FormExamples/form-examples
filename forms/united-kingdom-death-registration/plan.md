# United Kingdom death registration (England and Wales) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-11-20: foundation docs (`index.md`, `spec/index.md`,
`AGENTS.md`, `plan.md`, `tasks.md`, `doc/`); SQL plus generated representations
(XML, FHIR R5, protobuf, OpenAPI, Axum setup); both front-ends; the Axum JSON-API
crate; `CHANGELOG.md`, `examples/` and nine personas.

## Roadmap

- [x] Research the GOV.UK / GRO rules and cite them in `doc/` and `spec/`.
- [x] SQL: `patient`, `informant`, main table, grade / rule / flag triad.
- [x] Completeness engine (HTML and Svelte) with unit tests and personas.
- [x] HTML wizard and dashboard; SvelteKit wizard, report and dashboard.
- [x] Axum crate with request validation and cursor paging.
- [ ] Mutation baseline row for this form (maintainer-run; `bin/mutation-test-engines`).
- [ ] Add Welsh and bank-holiday-aware day counting if GOV.UK guidance changes.

## Design notes

- Process classification, not a score. Coroner pending outranks every other issue
  because nothing else can proceed.
- The 5-day clock counts calendar days from the medical examiner's confirmation, as
  GOV.UK states that weekends and bank holidays count. It is paused (not reset) while
  a coroner referral is pending.
- Scotland (8 days) and Northern Ireland are out of scope and flagged, not computed.
- `asOfDate` is explicit so the engine is deterministic and personas never rot.
