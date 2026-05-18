# Agile Checklist — Rust full-stack (Loco / Tera / HTMX / Alpine)

Server-rendered Rust backend for the agile-checklist form. Loco 0.16
on axum 0.8 with SeaORM 1.1 against PostgreSQL. UI is Tera templates
enhanced with HTMX 2.0.8 (partial swaps) and Alpine.js 3.14.8 (local
state).

## Stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Status

Pending — not yet scaffolded. Use the
`../full-stack-with-loco-tera-htmx-alpine-new/00-new.sh` setup script
as the starting point. The SQL schema in `../sql-migrations/` is
canonical; SeaORM entities should be regenerated whenever the schema
changes.

## Run

```sh
cd full-stack-with-loco-tera-htmx-alpine
cargo loco start
```
