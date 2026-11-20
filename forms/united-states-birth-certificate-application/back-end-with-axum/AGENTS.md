# United States Birth Certificate Application — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the United States Birth Certificate Application form, built with axum, axa, sqlx,
and PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`united_states_birth_certificate_application/`](./united_states_birth_certificate_application/) — the crate: `src/united_states_birth_certificate_application/` holds `app.rs`
  (wiring and route registration), `controllers/`, `models/`, `support/`, and
  `bin/main.rs`; alongside `migrations/` (plain SQL) and `tests/`. Settings come
  from the environment.
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

  - `applicant`
  - `openapi`
  - `registrant`
  - `united_states_birth_certificate_application`
  - `united_states_birth_certificate_application_grade`
  - `united_states_birth_certificate_application_grade_flag`
  - `united_states_birth_certificate_application_grade_rule`

## Engine

`src/united_states_birth_certificate_application/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd united_states_birth_certificate_application && cargo check --all-targets && cargo test
```
