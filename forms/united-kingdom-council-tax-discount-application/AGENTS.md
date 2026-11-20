# United Kingdom Council Tax Discount Application — Agent Instructions

A single-page wizard for applying to an English billing authority for a Council
Tax discount, exemption or reduction. The engine is a **completeness and
eligibility** engine: it classifies an application as `likely-eligible`,
`incomplete` or `likely-ineligible` and raises flagged issues. Eligibility is
decided by the billing authority; keep the disclaimer in every report.

See [`index.md`](./index.md) and [`spec/index.md`](./spec/index.md).

## Directory map

- `./spec/` — living domain spec
- `./doc/` — GOV.UK and statute research
- `./sql/` — PostgreSQL migrations (source of truth)
- `./xml/`, `./fhir/r5/`, `./protobuf/`, `./openapi/` — generated; never hand-edit
- `./front-end-with-html/` — wizard and dashboard (Lily); engine in `js/rules.js`, `js/grader.js`, `js/flags.js`
- `./front-end-with-svelte/` — SvelteKit wizard and dashboard; engine in `src/lib/engine/`
- `./back-end-with-axum/` — Rust axum + axa + sqlx JSON API
- `./examples/` — fixtures and `personas.json`

## Validation engine

- Input: the six-section application state (`claim`, `applicant`, `property`,
  `household`, `evidence`, `declaration`).
- Output of `validateApplication(state)`:
  `{ eligibilityClass, countedAdults, indicativeOutcome }`.
- `detectFlaggedIssues(state)` returns the flags; the engine is split, as in
  `medical-certificate-of-cause-of-death`.
- Precedence: likely-ineligible, then incomplete, then likely-eligible.
- Tests: `bin/test-personas united-kingdom-council-tax-discount-application`
  and vitest in the Svelte front-end.

## Verify

```sh
bin/test-form united-kingdom-council-tax-discount-application
bin/test-personas united-kingdom-council-tax-discount-application
bin/test-engines united-kingdom-council-tax-discount-application
bin/test-examples-conformance united-kingdom-council-tax-discount-application
bin/test-sql-apply united-kingdom-council-tax-discount-application
bin/test-e2e --html united-kingdom-council-tax-discount-application
```

## Conventions

`''` for unanswered text and enums, `null` for unanswered numbers and dates;
camelCase in JS and TypeScript, snake_case in SQL; Oxford `-ize` spelling.
