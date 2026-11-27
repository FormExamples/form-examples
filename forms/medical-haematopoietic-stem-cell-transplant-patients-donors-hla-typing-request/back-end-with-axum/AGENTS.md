# Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request form, built with axum, axa, sqlx,
and PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request/`](./medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request/) — the crate: `src/medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request/` holds `app.rs`
  (wiring and route registration), `controllers/`, `models/`, `support/`, and
  `bin/main.rs`; alongside `migrations/` (plain SQL) and `tests/`. Settings come
  from the environment.
- **Relational per-table schema** mirroring [`../sql/`](../sql/): one sqlx
  model and one RESTful scaffold controller per SQL table — patients,
  clinicians, the form's own tables, and (where the form is scored) the
  grade / grade_rule / grade_flag tables. There is no single JSONB blob table.

## JSON API

A RESTful JSON resource is served per domain table under `/api/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request/…`, each
supporting list (`GET`), create (`POST`), and `GET` / `PUT` / `PATCH` /
`DELETE` by id. All bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`. Prometheus metrics are exposed at
`/metrics`. The registered domain controllers are:

  - `clinician`
  - `hsct_hla_typing_request`
  - `hsct_hla_typing_request_grade`
  - `hsct_hla_typing_request_grade_flag`
  - `hsct_hla_typing_request_grade_rule`
  - `openapi`
  - `subject`

## Engine

`src/medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request && cargo check --all-targets && cargo test
```
