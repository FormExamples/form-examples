# United Kingdom Council Tax Discount Application — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-11-20.

## Roadmap

1. **Foundation docs** — index, spec, doc, agent instructions. Done.
2. **SQL migrations** — `applicant`, `billing_authority`, main application,
   `occupant`, and the grade triad. Done.
3. **Generated representations** — XML, FHIR R5, protobuf, OpenAPI, Axum setup. Done.
4. **Eligibility engine** — rules, grader and flags with personas. Done.
5. **Front-ends** — HTML wizard and dashboard, SvelteKit wizard and dashboard. Done.
6. **Back-end** — Axum JSON API crate. Done.
7. **Verification** — personas, engines, conformance, e2e, cargo test. Done.
