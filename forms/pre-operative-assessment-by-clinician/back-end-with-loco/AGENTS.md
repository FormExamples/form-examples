# Pre-operative Assessment by Clinician — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Pre-operative Assessment by Clinician form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`pre_operative_assessment_by_clinician/`](./pre_operative_assessment_by_clinician/) — the Loco crate: `src/pre_operative_assessment_by_clinician/` holds `app.rs`
  (route registration), `controllers/`, `models/`, `bin/main.rs`; alongside
  `migration/`, `config/` (dev / test / production YAML), and `tests/`.
- **Relational per-table schema** mirroring [`../sql/`](../sql/): one SeaORM
  model and one RESTful scaffold controller per SQL table — patients,
  clinicians, the form's own tables, and (where the form is scored) the
  grade / grade_rule / grade_flag tables. There is no single JSONB blob table.

## JSON API

A RESTful JSON resource is served per domain table under `/api/…`, each
supporting list (`GET`), create (`POST`), and `GET` / `PUT` / `PATCH` /
`DELETE` by id. All bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`. Prometheus metrics are exposed at
`/metrics`. The registered domain controllers are:

  - `allergy`
  - `clinician`
  - `medication`
  - `patient`
  - `patient_allergy`
  - `patient_medication`
  - `pre_operative_assessment_by_clinician`
  - `pre_operative_assessment_by_clinician_grade`

## Engine

`src/pre_operative_assessment_by_clinician/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd pre_operative_assessment_by_clinician && cargo check --all-targets && cargo test
```
