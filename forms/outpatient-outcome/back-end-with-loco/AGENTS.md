# Outpatient Outcome Report — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Outpatient Outcome Report form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`outpatient_outcome/`](./outpatient_outcome/) — the Loco crate: `src/outpatient_outcome/` holds `app.rs`
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

  - `clinician`
  - `outpatient_outcome`
  - `outpatient_outcome_clinical`
  - `outpatient_outcome_encounter`
  - `outpatient_outcome_followup`
  - `outpatient_outcome_operational`
  - `outpatient_outcome_prem_fft`
  - `outpatient_outcome_prom_eq5d5l`
  - `outpatient_outcome_prom_grc`
  - `outpatient_outcome_prom_promis`
  - `patient`

## Engine

`src/outpatient_outcome/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd outpatient_outcome && cargo check --all-targets && cargo test
```
