# UK NHS Digital Technology Assessment Criteria (DTAC) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the UK NHS Digital Technology Assessment Criteria (DTAC) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`uk_nhs_digital_technology_assessment_criteria/`](./uk_nhs_digital_technology_assessment_criteria/) — the Axum crate: `src/uk_nhs_digital_technology_assessment_criteria/` holds `app.rs`
  (route registration), `controllers/`, `models/`, `bin/main.rs`; alongside
  `migrations/` (plain SQL) and `tests/`. Settings come from the environment.
- **Relational per-table schema** mirroring [`../sql/`](../sql/): one sqlx
  model and one RESTful scaffold controller per SQL table — patients,
  clinicians, the form's own tables, and (where the form is scored) the
  grade / grade_rule / grade_flag tables. There is no single JSONB blob table.

## JSON API

A RESTful JSON resource is served per domain table under `/api/…`, each
supporting list (`GET`), create (`POST`), and `GET` / `PUT` / `PATCH` /
`DELETE` by id. All bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`. Prometheus metrics are exposed at
`/metrics`. The registered domain controllers are:

  - `assessor`
  - `openapi`
  - `product`
  - `supplier`
  - `uk_nhs_digital_technology_assessment_criteria`
  - `uk_nhs_digital_technology_assessment_criteria_grade`
  - `uk_nhs_digital_technology_assessment_criteria_grade_flag`
  - `uk_nhs_digital_technology_assessment_criteria_grade_rule`

## Engine

`src/uk_nhs_digital_technology_assessment_criteria/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd uk_nhs_digital_technology_assessment_criteria && cargo check --all-targets && cargo test
```
