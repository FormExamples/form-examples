# Radiology Waiting List Card — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Radiology Waiting List Card form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`radiology_waiting_list_card/`](./radiology_waiting_list_card/) — the Loco crate: `src/radiology_waiting_list_card/` holds `app.rs`
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

  - `radiology_waiting_list_card`
  - `radiology_waiting_list_card_appointment`
  - `radiology_waiting_list_card_grade`
  - `radiology_waiting_list_card_grade_flag`
  - `radiology_waiting_list_card_grade_rule`
  - `patient`
  - `practitioner`

## Engine

`src/radiology_waiting_list_card/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd radiology_waiting_list_card && cargo check --all-targets && cargo test
```
