# Return to Work — Rust full-stack

Rust full-stack server for the Return to Work form. Loco 0.16 on
axum 0.8, SeaORM 1.1 against PostgreSQL, Tera templates with
HTMX 2.0.8 and Alpine.js 3.14.8.

The server provides both:

1. A **server-rendered UI** at `/` (HTMX-augmented Tera templates,
   functionally equivalent to the SvelteKit wizard).
2. A **JSON API** at `/api/v1/return-to-work` consumed by the
   SvelteKit and HTML dashboards.

## Stack

- Rust edition 2024
- Loco 0.16 framework
- axum 0.8
- SeaORM 1.1
- Tera templates
- HTMX 2.0.8
- Alpine.js 3.14.8
- Tower middleware (`tower-http`)
- PostgreSQL via `sqlx` migrations (matching `../sql-migrations/`)

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Landing |
| `GET` | `/assessment/new` | Start a new assessment |
| `GET` | `/assessment/:id/step/:n` | Render step `n` (1-12) |
| `POST` | `/assessment/:id/step/:n` | Persist step `n` |
| `GET` | `/assessment/:id/report` | HTML preview |
| `GET` | `/assessment/:id/pdf` | PDF download |
| `GET` | `/api/v1/return-to-work` | JSON list |
| `GET` | `/api/v1/return-to-work/:id` | JSON single |
| `POST` | `/api/v1/return-to-work` | JSON create |
| `PATCH` | `/api/v1/return-to-work/:id` | JSON update |
| `GET` | `/api/v1/return-to-work/:id/fhir` | FHIR R5 Bundle |

## SeaORM entities

Generated from `../sql-migrations/`:

- `patient`
- `clinician`
- `employer`
- `return_to_work`
- `return_to_work_restriction`
- `return_to_work_grade`
- `return_to_work_grade_rule`
- `return_to_work_grade_flag`

## Scoring engine

Ported from
`../front-end-form-with-svelte/src/lib/engine/composite-grader.ts`
to `src/services/grader/`:

- `types.rs`
- `fitness_rules.rs`
- `restriction_rules.rs`
- `flagged_issues.rs`
- `composite_grader.rs`

Pure functions with no I/O; unit-tested with `#[test]` in the same
modules.

## Running

```sh
cargo run start
```

## Verifying

```sh
cargo build
RUSTFLAGS=-Awarnings cargo check
cargo test
```
