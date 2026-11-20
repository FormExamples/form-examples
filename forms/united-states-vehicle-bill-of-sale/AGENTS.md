# United States Vehicle Bill of Sale — Agent Instructions

Agent instructions for the United States vehicle bill-of-sale form. See
[`index.md`](index.md) for the design description and
[`spec/index.md`](spec/index.md) for the living spec (update it before changing
code).

## Directory map

| Path | Role |
| --- | --- |
| `sql/` | PostgreSQL migrations (source of truth): `seller`, `buyer`, the main bill of sale, and the `_grade` / `_grade_rule` / `_grade_flag` triad |
| `xml/`, `fhir/r5/`, `protobuf/`, `openapi/` | generated representations; never hand-edit |
| `front-end-with-html/` | wizard (`index.html`) + dashboard; engine in `js/rules.js`, `js/grader.js`, `js/flags.js` |
| `front-end-with-svelte/` | SvelteKit wizard + dashboard; engine port in `src/lib/engine/` |
| `back-end-with-axum/` | Rust JSON API (axum + axa + sqlx) |
| `examples/` | `assessment.json`, FHIR bundle, and `personas.json` (the engine oracle) |
| `doc/` | research and citations |

## Scoring engine

A completeness and risk-classification engine, not a numeric score. The HTML
engine is the reference: `rules.js` (predicates, `STATE_RULES`, VIN check digit,
odometer exemption), `grader.js` (`validateBillOfSale` returns the class plus
`odometerExempt` and `stateRuleKnown`), `flags.js` (`detectFlaggedIssues`, 18
flags). The Svelte engine in `front-end-with-svelte/src/lib/engine/` is a
TypeScript port with vitest tests that also run every persona. Keep
`createDefaultBillOfSale()` in `engine/defaults.ts`, not in the
`$app/environment`-importing store.

## Classes

- **Complete**: all required items recorded, no risk condition.
- **Incomplete**: a required item, signature, odometer disclosure, or required
  notarization is missing.
- **Risk flagged**: odometer discrepancy, invalid VIN, outstanding lien, no title
  in hand, or a branded title (takes precedence over incomplete).

## State rules

`STATE_RULES` encodes CA, NY, TX, FL, IL, PA, OH, WA, and LA. Any other state
falls back to a uniform default and raises `F-BOS-014`. Re-verify the table
against the agencies before relying on it (`spec/index.md` §4 records which rows
were read from an agency page). Edit `rules.js` and `bill-of-sale-rules.ts`
together, then update the spec and the personas.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for unanswered
  numeric and date fields.
- camelCase in TypeScript; snake_case in SQL and Rust.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Axum setup) are never
  hand-edited.
- Always include the disclaimer: documentation support, not legal advice; the
  state agency decides.

## Compliance

Documentation-support tool; not a medical device and not legal advice. See
[`spec/index.md`](spec/index.md) §9.

## Verify

```sh
bin/test-form united-states-vehicle-bill-of-sale
bin/test-personas united-states-vehicle-bill-of-sale
bin/test-engines united-states-vehicle-bill-of-sale
bin/test-examples-conformance united-states-vehicle-bill-of-sale
bin/test-sql-apply united-states-vehicle-bill-of-sale
bin/test-e2e --html united-states-vehicle-bill-of-sale
```
