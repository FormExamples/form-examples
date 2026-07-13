# Mental Health Assessment — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Mental Health Assessment form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`mental_health_assessment/`](./mental_health_assessment/) — the Loco crate: `src/mental_health_assessment/` holds `app.rs`
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

  - `assessment`
  - `assessment_current_medications`
  - `clinician`
  - `patient`

## Engine

`src/mental_health_assessment/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd mental_health_assessment && cargo check --all-targets && cargo test
```
