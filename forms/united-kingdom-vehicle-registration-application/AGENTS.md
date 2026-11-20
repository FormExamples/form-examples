# United Kingdom Vehicle Registration Application — Agent Instructions

Registering a vehicle with the DVLA in Great Britain: a V62 replacement V5C, or a
V55/4, V55/5, import, or V627/1 first registration. Collects the applicant,
keeper and owner, vehicle identity, supporting evidence, and fee via a single
continuous single-page wizard. The engine is a **completeness and validity**
engine — not a clinical score: it classifies the application as **Ready to
submit**, **Incomplete**, or **Needs supporting documents**, works out the fee,
and raises flagged issues.

See [`index.md`](./index.md) for the design and the step table,
[`spec/index.md`](./spec/index.md) for the living domain spec, and
[`doc/index.md`](./doc/index.md) for the GOV.UK research and the assumptions.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — GOV.UK / DVLA research notes and assumptions
- `./sql/` — PostgreSQL migrations (source of truth): `applicant`, `keeper`, the
  main table, and the `_grade`, `_grade_rule`, `_grade_flag` children
- `./xml/`, `./fhir/`, `./protobuf/`, `./openapi/` — generated, never hand-edited
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-axum/` — Rust Axum JSON API (relational per-table)
- `./back-end-with-axum-setup` — generated scaffold script
- `./examples/` — filled-form fixtures and `personas.json`
- `./skills/` — generated Claude Code skills

## Validation engine

Pure functions: `validateApplication(state)` returns
`{ validityClass, feeDueAsPence, missingItemCount, rules }` and
`detectFlaggedIssues(state)` returns the flags.

- HTML: `front-end-with-html/js/{types,rules,grader,flags}.js` (ES modules).
- Svelte: `front-end-with-svelte/src/lib/engine/{types,utils,vra-rules,vra-grader,flagged-issues}.ts`
  with `vra-grader.test.ts`, which also replays every persona.
- The two engines must agree; `examples/personas.json` is the oracle
  (`bin/test-personas`) and the Svelte test replays it.

Every age rule uses `applicationDate`, never the wall clock.

## Validity classes

1. `incomplete` — any data item missing, a format check failed, the vehicle is
   seriously damaged, or the declaration is unsigned.
2. `needs-supporting-documents` — a document or the fee is missing.
3. `ready-to-submit`.

## Fees

V62 £25 (waived with a new-keeper slip, or a V5C not received and chased within 6
weeks); first registration, import, V627/1 £55. Cheque or postal order to DVLA,
Swansea; never cash.

## Flagged issues

`seriously-damaged`, `identity-evidence-missing`, `type-approval-missing`,
`mot-missing`, `insurance-missing`, `nova-missing`, `fee-incorrect`,
`declaration-unsigned`, `entitlement-missing`, `keeper-owner-mismatch`,
`vin-invalid`, `registration-number-invalid`, `v5c-lost-stolen-destroyed`.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Axum setup) are never
  hand-edited.

## Statutory grounding

- GOV.UK and DVLA guidance on registering a vehicle (see `doc/index.md`).
- Vehicle Excise and Registration Act 1994.
- Road Vehicles (Registration and Licensing) Regulations 2002.
- HMRC Notification of Vehicle Arrivals (NOVA) for imports.

## Compliance

- ISO/IEC/IEEE 26514:2022.
- Not a medical device; no clinical purpose.

This form is a completeness aid only. The DVLA decides every application.

## Verify

```sh
bin/test-form united-kingdom-vehicle-registration-application
bin/test-personas united-kingdom-vehicle-registration-application
bin/test-engines united-kingdom-vehicle-registration-application
```
