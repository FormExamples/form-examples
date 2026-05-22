# OKR Tracker — Full stack with Loco / Tera / HTMX / Alpine.js

Server-rendered Rust web app for the OKR tracker, planned to host both the
wizard and the dashboard from a single Loco binary.

- Backend: Loco-rs 0.16 on axum 0.8, SeaORM 1.1 on PostgreSQL
- Templates: Tera with HTMX partial updates and Alpine.js for tiny interactions
- Scoring: Plan 1's Rust engine reused unchanged

This sub-project currently builds (`cargo build`) and the 31 Plan-1 engine
tests still pass (`cargo test --lib`). The wizard / dashboard / export
endpoints are placeholders pending Postgres + `cargo loco generate scaffold`
(see `../full-stack-with-loco-tera-htmx-alpine-setup`).

See [the parent form's index.md](../index.md) and
[the design spec](../../../docs/superpowers/specs/2026-05-08-objectives-and-key-results-tracker-design.md).

## Verify

```sh
cargo build
cargo test --lib
```

## Bring up the server (requires Postgres)

```sh
# 1. Create database role and databases (idempotent):
psql -c "CREATE ROLE loco WITH LOGIN PASSWORD 'loco' CREATEDB;" postgres || true
createdb -O loco objectives_and_key_results_tracker_development || true

# 2. Run scaffold + start (planned):
../full-stack-with-loco-tera-htmx-alpine-setup
cargo run -- start
```
