# Agent notes — Full stack with Loco / Tera / HTMX / Alpine.js

Server-rendered Rust web app for the OKR tracker. Loco-rs 0.16 on axum 0.8,
SeaORM 1.1 with PostgreSQL, Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8.
Plan 1's scoring engine (`src/scoring/`) is reused unchanged.

## Status

This sub-project is **Plan 6 scaffold (path 2)** — the crate compiles end-to-end
and `bin/test-form` passes, but the server is not yet wired up to a live
Postgres and the wizard / dashboard / export endpoints are placeholders.

Compiles:
- `cargo build` — full Loco workspace
- `cargo test --lib` — 31 Plan 1 engine tests still pass
- `cargo build -p migration` — 9 SeaORM migrations defined

Pending (requires Postgres + further work):
- Run `../full-stack-with-loco-tera-htmx-alpine-setup` to scaffold models / controllers / views via `cargo loco generate scaffold`
- Wire generated controllers into `routes()` in `src/app.rs`
- Server-rendered wizard (10 Tera step partials) with HTMX KR add / remove
- Score endpoint persisting to `okr_grade*` tables
- Export endpoints: PDF, JSON, FHIR R5 `Goal`, XML, plain-text triage
- Integration tests in `tests/requests/` and Playwright suite in `tests/playwright/`

## Layout

- `Cargo.toml` — workspace root (`.` + `migration`)
- `migration/` — SeaORM migration crate; one file per table mirroring `../sql-migrations/`
- `src/lib.rs` — exposes `app`, `controllers`, `scoring` modules
- `src/app.rs` — Loco `Hooks` impl (boots `create_app::<App, Migrator>`)
- `src/bin/main.rs` — Loco CLI entry point
- `src/controllers/home.rs` — stub `/` route (default route mounting; the scaffold script adds the real controllers)
- `src/scoring/` — Plan 1 engine (unchanged)
- `config/{development,test,production}.yaml` — Loco config; DB name pattern `objective_and_key_result_tracker_{env}`
- `templates/base.html.tera` — HTMX + Alpine.js CDN script tags, `<body hx-boost="true">`
- `templates/dashboard/`, `templates/objectives/` — placeholder Tera templates
- `assets/static/` — CSS / JS served at `/static`
- `assets/views/` — Tera include directory placeholder

## Conventions

- Rust edition 2024, `snake_case` SQL columns, `camelCase` Rust serde via `#[serde(rename_all = "camelCase")]`
- UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every table
- One migration file per entity, prefix `m20260510_NNNNNN_…`
- `cargo loco generate scaffold` (from the setup script) writes models into `src/models/` and routes into `src/controllers/` — these are not yet checked in because they need a live DB connection to be generated correctly

## Parent docs

- [`../AGENTS.md`](../AGENTS.md)
- [Design spec](../../../docs/superpowers/specs/2026-05-08-objective-and-key-result-tracker-design.md)
- [Full-stack plan](../../../docs/superpowers/plans/2026-05-10-okr-tracker-plan-6-full-stack-rust.md)
- [`AGENTS/full-stack-with-loco-tera-htmx-alpine.md`](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
