# United States Property Tax Exemption Application - Agent Instructions

A county or state application for a residential homestead exemption and related
relief (senior, disability, disabled veteran, circuit-breaker) with
assessment-appeal basics, collected through a single continuous single-page
wizard. The engine is a **completeness and eligibility** engine, not a numeric
score: it classifies the application as **likely-eligible**, **incomplete** or
**likely-ineligible** and raises prioritized flags. State rules live in the
`STATE_RULES` table. Documentation support, not legal advice.

See [`index.md`](./index.md) for the design and [`spec/index.md`](./spec/index.md)
for the living domain spec.

## Directory map

- `./index.md`, `./AGENTS.md`, `./spec/`, `./plan.md`, `./tasks.md`, `./doc/` (state-law research and citations)
- `./sql/` - PostgreSQL schema (source of truth): `applicant`, `assessor`, `property_tax_exemption_application` and the grade / rule / flag triad
- `./xml/`, `./fhir/`, `./protobuf/`, `./openapi/` - generated; never hand-edited
- `./front-end-with-html/` - HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` - SvelteKit wizard + dashboard (Lily)
- `./back-end-with-axum/` - Rust axum + axa + sqlx JSON API

## Scoring engine

- **Input:** `PropertyTaxApplication` - applicant, property, exemptions, income, documents, filing, appeal, declaration.
- **Output:** `gradeApplication(d)` returns `{ eligibilityClass, filingDeadline, filedLate, qualifyingExemptions, rules }`; `detectFlaggedIssues(d)` returns the flags (a split engine).
- **Classification:** likely-ineligible beats incomplete beats likely-eligible (spec section 4.2).
- **State rules:** edit `STATE_RULES` in `front-end-with-html/js/rules.js` and the Svelte port `src/lib/engine/rules.ts` together, update `spec/index.md` section 4.1 and `doc/index.md`, then `bin/test-personas united-states-property-tax-exemption-application --update`.

## Verify

```sh
bin/test-form united-states-property-tax-exemption-application
bin/test-sql-apply united-states-property-tax-exemption-application
bin/test-personas united-states-property-tax-exemption-application
bin/test-engines united-states-property-tax-exemption-application
bin/test-examples-conformance united-states-property-tax-exemption-application
bin/test-e2e --html united-states-property-tax-exemption-application
```
