# Meeting — Full-stack (Rust) Agent Instructions

Canonical Rust full-stack for the meeting form. See
[`AGENTS/full-stack-with-loco-tera-htmx-alpine.md`](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
for the stack-wide contract.

## Tools

- `cargo build` — compile.
- `cargo loco start` — run the dev server with auto-migration.
- `cargo test` — Rust unit tests including `validate_meeting()`.
- `../full-stack-with-loco-tera-htmx-alpine-setup` — the scaffold script
  that regenerates the project shell via `cargo loco generate scaffold`.

## File naming convention

- `src/models/<entity>.rs` — SeaORM entity per SQL table.
- `src/controllers/<entity>.rs` — axum routes per entity.
- `src/views/<entity>/*.tera` — Tera templates per entity.
- `assets/static/*.js` — Alpine.js controllers.
- `migration/src/m_*_create_<entity>.rs` — SeaORM migrations.

## Contents

- `./index.md` — overview
- `./AGENTS.md` — this file
- `./CLAUDE.md` — Claude Code project instructions (defers to `AGENTS.md`)
- `./plan.md` — implementation roadmap
- `./tasks.md` — task tracking

## Stack

- Rust edition 2024.
- Loco 0.16 framework on axum 0.8.
- SeaORM 1.1 with PostgreSQL.
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8.
- `serde(rename_all = "camelCase")` on every struct shared with the
  front-end.

## Conventions

- snake_case Rust identifiers; camelCase serde rename on shared structs.
- UUIDv4 primary keys via `uuid::Uuid::new_v4()`.
- Migrations carry the canonical timestamps trio
  (`created_at`, `updated_at`, `deleted_at`).
- Validation engine ported by hand from the SvelteKit `validateMeeting()`
  and kept in sync via `cargo test`.

## Verify

```sh
bin/test-form meeting
```
