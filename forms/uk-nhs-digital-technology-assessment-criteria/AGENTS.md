# UK NHS Digital Technology Assessment Criteria — Agent Instructions

Records a DTAC assessment of a digital health technology: 47 criteria in seven sections,
34 mandatory. See [`index.md`](./index.md) and [`spec/index.md`](./spec/index.md).

## Directory map

- `./index.md`, `./spec/` — design and living spec
- `./doc/criteria-catalogue.md` — every criterion with its column name and mandatory flag
- `./sql/` — Postgres migrations (source of truth)
- `./xml/`, `./fhir/r5/`, `./protobuf/`, `./openapi/` — generated; never hand-edit
- `./front-end-with-html/`, `./front-end-with-svelte/`, `./back-end-with-loco/` — not yet built (see `tasks.md`)

## Scoring engine (planned)

Pure function over the criterion statuses returning `outcome`, `sections`, `firedRules`,
`flags`, per the rules in `index.md`. Engine-first: write and test it before any UI.

## Verify

```sh
bin/test-form uk-nhs-digital-technology-assessment-criteria
bin/test-sql-apply uk-nhs-digital-technology-assessment-criteria
bin/test-examples-conformance uk-nhs-digital-technology-assessment-criteria
```
