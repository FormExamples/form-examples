# United Kingdom Vehicle Bill of Sale — Agent Instructions

A bill of sale for a private UK vehicle sale. A single continuous single-page
wizard; the engine is a **completeness and validity** engine (not a score) that
classifies the record **Complete**, **Incomplete**, or **Risk flagged** and
raises flagged issues. It is documentation support, not legal advice.

See [`index.md`](./index.md) and [`spec/index.md`](./spec/index.md).

## Directory map

- `./index.md`, `./AGENTS.md`, `./plan.md`, `./tasks.md`, `./CHANGELOG.md`
- `./spec/` — living domain spec
- `./doc/` — GOV.UK, DVLA, Citizens Advice, and statute references
- `./sql/` — PostgreSQL schema (source of truth)
- `./xml/`, `./fhir/`, `./protobuf/`, `./openapi/` — generated
- `./examples/` — fixtures and `personas.json`
- `./front-end-with-html/`, `./front-end-with-svelte/` — wizard and dashboard
- `./back-end-with-axum/` — Rust axum + axa + sqlx JSON API

## Engine

- **Input shape:** `BillOfSale` (sections `sale`, `seller`, `buyer`, `vehicle`,
  `checks`, `payment`, `condition`, `dvla`, `signatures`).
- **Output shape:** `assessBillOfSale(state)` returns
  `{ classification, missingItemCount, riskFlagCount, missingItems }`;
  `detectFlaggedIssues(state)` returns the sorted flag list.
- **Algorithm:** risk conditions first (`risk-flagged`), else any missing
  required item (`incomplete`), else `complete`. See spec §4.
- **Files (HTML):** `js/rules.js`, `js/grader.js`, `js/flags.js`, `js/types.js`.
  **Svelte:** `src/lib/engine/bill-of-sale-rules.ts`, `bill-of-sale-grader.ts`,
  `flagged-issues.ts`, `types.ts`, with Vitest tests.

## Conventions

- `''` for unanswered text and enum fields; `null` for unanswered numeric and
  date fields.
- camelCase in TypeScript, snake_case in SQL and Rust; UUIDv4 primary keys;
  `created_at`, `updated_at`, `deleted_at` on every table.
- Generated artefacts are never hand-edited.
- Prose uses Oxford `-ize` spelling.

## Compliance

Non-clinical administrative form. Not a medical device. Grounded in GOV.UK
vehicle guidance, the Sale of Goods Act 1979, and the Consumer Rights Act 2015
(trader sales).

## Verify

```sh
bin/test-form united-kingdom-vehicle-bill-of-sale
```
