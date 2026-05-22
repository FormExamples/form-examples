# Return to Work — Rust full-stack Agent Instructions

Loco 0.16 + axum 0.8 + SeaORM + Tera + HTMX + Alpine Rust backend.
See [`index.md`](./index.md) for the route table and entity list.

## Stack

- Rust edition 2024
- Loco 0.16 + axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates
- HTMX 2.0.8 and Alpine.js 3.14.8 (loaded from CDN in
  `templates/base.html.tera`)
- `serde(rename_all = "camelCase")` for front-end interop

## Conventions

- snake_case in Rust modules, fields, and database columns.
- camelCase in JSON payloads (via `serde(rename_all)`).
- UUIDv4 primary keys.
- `created_at`, `updated_at`, `deleted_at` on every entity.
- The base Tera template **must** include the HTMX and Alpine
  CDN script tags exactly as expected by `bin/test-form`:
  ```html
  <script defer src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
  <body hx-boost="true">
  ```

## Composite grader

The composite grader is a pure Rust port of the TypeScript engine.
Tests live alongside the modules with `#[cfg(test)] mod tests {}`.

## Verifying

```sh
cargo build
RUSTFLAGS=-Awarnings cargo check
cargo test
```
