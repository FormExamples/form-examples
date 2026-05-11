# Issue Tracker — full-stack with Rust + axum + Loco + Tera + HTMX + Alpine.js

Server-rendered Rust application using Loco on axum, with Tera templates,
HTMX 2.0.8 for AJAX navigation, and Alpine.js 3.14.8 for client-side
conditional fields and dynamic lists.

## Status

Scaffold only. `Cargo.toml`, `.gitignore`, `src/bin/main.rs`, the base
Tera template, and the development / test / production config files are
in place. The full controllers, models, migrations, and views are
produced by running the form's
`full-stack-with-loco-tera-htmx-alpine-setup` shell script.

## Stack

- Rust edition 2024 (1.85+)
- Loco 0.16 on axum 0.8
- SeaORM 1.1 with PostgreSQL 18
- Tera 1.20 + HTMX 2.0.8 + Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop
- UUIDv4 primary keys

## Commands

```sh
cargo loco start                # Development server (port 5150)
cargo build                     # Development build
cargo build --release           # Production build
cargo test                      # All tests
cargo loco db migrate           # Apply migrations
cargo loco db reset             # Reset the database
cargo loco db seed              # Seed sample data
```

## Database

```yaml
# config/development.yaml
database:
  uri: postgres://loco:loco@localhost:5432/issue_tracker_development
```

```sh
createdb --host=localhost --port=5432 --username=postgres --owner=loco issue_tracker_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco issue_tracker_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco issue_tracker_production || :
```

See [`AGENTS/full-stack-with-loco-tera-htmx-alpine.md`](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
for the full conventions.
