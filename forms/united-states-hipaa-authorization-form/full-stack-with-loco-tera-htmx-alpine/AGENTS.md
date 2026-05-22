# full-stack-with-loco-tera-htmx-alpine — Agent Instructions

Rust full-stack implementation of the HIPAA authorization form. See
[`AGENTS/full-stack-with-loco-tera-htmx-alpine.md`](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
for stack-wide conventions.

## Stack

- Rust edition 2024
- Loco 0.16, axum 0.8, SeaORM 1.1 with PostgreSQL
- Tera 1.20 templates
- HTMX 2.0.8 and Alpine.js 3.14.8 (loaded via CDN in
  `templates/base.html.tera`)
- `serde(rename_all = "camelCase")` for parity with the SvelteKit
  front-end

## Layout

- `Cargo.toml` — crate manifest.
- `src/lib.rs`, `src/app.rs` — Loco app wiring.
- `src/bin/main.rs` — CLI entrypoint.
- `src/controllers/` — HTTP controllers (one per entity).
- `src/models/` — SeaORM entity models (one per SQL table).
- `src/engine/` — validation engine port from TypeScript.
- `src/views/` — Tera template renderers.
- `templates/` — Tera templates.
- `templates/base.html.tera` — layout including HTMX + Alpine via
  CDN.
- `migration/` — SeaORM migrations.
- `assets/static/` — CSS, JS, images.
- `config/` — Loco config files.

## Conventions

- `snake_case` for SQL columns and Rust fields.
- `serde(rename_all = "camelCase")` on shared payload structs.
- UUIDv4 primary keys; `created_at`, `updated_at`, `deleted_at`
  timestamps.

## Develop

```sh
cargo loco start
cargo test
```
