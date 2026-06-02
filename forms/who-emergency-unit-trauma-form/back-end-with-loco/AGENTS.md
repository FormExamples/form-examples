# WHO Emergency Unit Trauma Form — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the WHO Emergency Unit Trauma Form form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Project structure

```
back-end-with-loco/
  Cargo.toml
  src/
    bin/main.rs               # Entry point
    lib.rs                    # Module declarations
    app.rs                    # Loco App impl, route registration
    controllers/
      assessment.rs           # JSON CRUD on /api/assessments
      dashboard.rs            # JSON list on /api/dashboard
    engine/                   # Form-specific scoring/grading engine
    models/                   # SeaORM entities + domain logic
  config/                     # Loco YAML configs (dev / test / production)
  migration/                  # SeaORM migration crate
  tests/                      # Engine + JSON API integration tests
```

There is no `templates/`, no `assets/`, no `src/views/`. The Cargo
manifest does not depend on `tera`.

## JSON API

| Method | Route                          | Purpose                                                  |
| ------ | ------------------------------ | -------------------------------------------------------- |
| GET    | `/api/assessments`             | List assessments (most recent first)                     |
| POST   | `/api/assessments`             | Create a new draft assessment                            |
| GET    | `/api/assessments/{id}`        | Return the assessment record                             |
| PATCH  | `/api/assessments/{id}`        | Merge a partial JSON body into the `data` JSONB column   |
| POST   | `/api/assessments/{id}/submit` | Mark as completed and return the record                  |
| GET    | `/api/assessments/{id}/result` | Return the stored grading result                         |
| GET    | `/api/dashboard`               | List completed assessments (`?status=`, `?limit=`)       |
| GET    | `/metrics`                     | Prometheus text-format scrape endpoint                   |

All request and response bodies are `application/json` with camelCase
keys via `serde(rename_all = "camelCase")`.

## Engine

The `src/engine/` module holds the form-specific scoring engine
(`types.rs`, plus a grader / calculator + rules files, and
`flagged_issues.rs`). The engine is exercised by `cargo test` and is
the contract that the per-form `spec.md` describes.

## Database

Single `assessments` table with JSONB `data` and `result` columns and
UUIDv4 primary keys. Loco-managed columns (`id`, `created_at`,
`updated_at`) come from SeaORM scaffolds.

## Tests

```sh
cargo test
```
