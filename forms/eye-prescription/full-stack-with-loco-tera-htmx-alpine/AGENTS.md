# Eye Prescription — Rust Full-Stack

Server-rendered full-stack implementation: axum 0.8 + Loco 0.16 + SeaORM
1.1 + PostgreSQL, with Tera templates, HTMX 2.0.8, and Alpine.js 3.14.8.

See the form-wide [`../AGENTS.md`](../AGENTS.md) for the design and
[`../full-stack-with-loco-tera-htmx-alpine-setup`](../full-stack-with-loco-tera-htmx-alpine-setup)
for the `cargo loco generate scaffold` commands that produce the
initial entities, migrations, controllers, and Tera views.

> **Status:** scaffolded; full implementation is deferred.

## Stack

- Rust edition 2024.
- Loco 0.16 framework on axum 0.8.
- SeaORM 1.1 with PostgreSQL.
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8.
- `serde(rename_all = "camelCase")` on every struct shared with the front-end.

## How to bootstrap

```sh
cd forms/eye-prescription
./full-stack-with-loco-tera-htmx-alpine-setup
cd full-stack-with-loco-tera-htmx-alpine
cargo loco start
```

The setup script creates the Postgres user / databases and runs
`cargo loco generate scaffold` for each of the 10 tables in the SQL
schema, producing axum routes, SeaORM entities, and Tera views.

## After scaffolding

1. **Re-author the migrations** in
   `migration/src/` from
   [`../sql-migrations/`](../sql-migrations/) so that Liquibase format
   matches Loco's migration-by-version format. CHECK constraints and
   COMMENT statements must be preserved.
2. **Author the classification engine** in `src/engine/`:
   - `refractive_rules.rs` — sphere / cylinder / addition band tables.
   - `complexity_grader.rs` — composite engine.
   - `flagged_issues.rs` — 11 safety flags.
3. **Author the FHIR exporter** in `src/fhir/` that emits a
   `VisionPrescription` Bundle.
4. **Author Tera templates** in `assets/views/` that mirror the
   SvelteKit form's UX (single-page 11-step wizard backed by HTMX swaps).
5. **Wire HTMX + Alpine.js** into `assets/views/base.html.tera` per the
   shared stack convention.

## base.html.tera contract

`bin/test-form` asserts:

- `<script defer src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>`
- `<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>`
- `<body hx-boost="true">`

## Verify

```sh
cargo build
cargo check
cargo test
```
