# Back-end with Rust Axum

Server-side Rust JSON API built directly on [Axum](https://docs.rs/axum),
[axa](https://crates.io/crates/axa), and [sqlx](https://docs.rs/sqlx). There is
**no HTML rendering layer**: no templates, no HTMX, no Alpine.js, no Lily
Design System, no CSS, no static assets. The crate is a pure back-end that
exposes JSON endpoints consumed by the separate `front-end-*-with-html/` and
`front-end-*-with-svelte/` subprojects. The contract each form's back-end must
satisfy is documented in the per-form `forms/<slug>/spec/index.md`; the
system-wide back-end rules live in [`../spec.md`](../spec.md) §6.

Slug: back-end-with-axum

- Search pattern: `forms/*/back-end-with-axum`

## Technology stack

| Component | Version | Purpose |
| --- | --- | --- |
| [Rust](https://rust-lang.org/) | 1.97+ | Systems programming language |
| [axum](https://crates.io/crates/axum) | 0.8 | Web application framework |
| [axa](https://crates.io/crates/axa) | 0.6 | Routes, middleware, errors, configuration, command line, job queue, test helpers |
| [axa-sqlx](https://crates.io/crates/axa-sqlx) | 0.1 | Pooling, migrations, and test resets, as `axa::sqlx` |
| [axa-problem](https://crates.io/crates/axa-problem) | 0.1 | RFC 9457 error responses, as `axa::problem` |
| [sqlx](https://crates.io/crates/sqlx) | 0.9 | Hand-written SQL against PostgreSQL |
| [PostgreSQL](https://www.postgresql.org/) | 18 | Database server |
| [serde](https://serde.rs/) | 1.x | Serialization with `rename_all = "camelCase"` |
| [uuid](https://crates.io/crates/uuid) | 1.x | UUIDv4 primary keys |
| [tokio](https://tokio.rs/) | 1.x | Async runtime |
| [chrono](https://crates.io/crates/chrono) | 0.4 | Timestamps with serde support |
| [validator](https://crates.io/crates/validator) | 0.20 | Model validation |

## Crate layout

Route layout: all crate source lives under `src/<form_snake_case>/`; the crate
root stays at `back-end-with-axum/`.

```txt
back-end-with-axum/
  Cargo.toml                  # [lib] and [[bin]] paths point into src/<form_snake_case>/
  deny.toml                   # Generated cargo-deny policy
  migrations/                 # Plain SQL: <version>_<name>.up.sql and .down.sql
  src/
    <form_snake_case>/
      bin/main.rs             # Parses the command line and calls App::run
      lib.rs                  # Crate root
      app.rs                  # Configuration, routes, workers, tasks, command line, test boot
      controllers/            # axum handlers per resource (JSON in, JSON out)
      engine/                 # Pure scoring / grading engine, where the form has one
      fixtures/               # YAML seed data
      models/                 # One struct and its SQL per table
      support/                # What axa leaves to each service (see below)
      views/                  # JSON response shapes
      workers/                # Background jobs
  tests/                      # Integration tests for the engine and JSON API
```

There is no `config/`, no `migration/` crate, no `templates/`, and no `assets/`.

### The support module

`src/<form_snake_case>/support/` holds what `axa` deliberately leaves to each
service, and it is identical in every crate, apart from rustfmt import order in
edition 2024 crates:

| File | Provides |
| --- | --- |
| `mod.rs` | `db(&ctx)`, the pool from `ctx.db`; `PAGE_LIMITS`, `cursor_key` and `cursor_page`; the rate limit; `yaml` |
| `model.rs` | `ModelError` and its HTTP mapping |
| `problem.rs` | The router under the standard middleware, with every failure rewritten as a problem |
| `seed.rs` | Loading a YAML fixture into a table |
| `prelude.rs` | Common imports for handlers and models |

Change these by editing `bin/back-end-with-axum/migrate-from-loco/support/` and
copying the result to every crate, so the copies stay identical.

## Back-end pattern

Each SQL table has a migration, a `models/<table>.rs` holding one `Model` struct
that derives `sqlx::FromRow`, and a RESTful controller. SQL is written by hand
and is plain to read:

```rust
impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as("INSERT INTO clinicians (name) VALUES ($1) RETURNING *")
            .bind(&self.name)
            .fetch_one(db)
            .await
    }
}
```

Queries are checked at runtime by the test suite, not at compile time, so a build
needs no database. `UPDATE` statements set `updated_at = now()` themselves.

The database enforces the CHECK constraints from `sql/`, through the migration
`20261107600000_check_constraints` that `bin/axum-check-constraints` writes, and the
`VARCHAR(n)` lengths, through `20261107700000_length_constraints`. Each is
`NOT VALID`, so new writes are checked and rows already stored are not; run `ALTER
TABLE ... VALIDATE CONSTRAINT` once old rows are fixed. `build.rs` makes Cargo rebuild
when `migrations/` changes, because `sqlx::migrate!` embeds the files at compile time.

## JSON API contract

Handlers take `State(ctx): State<AppContext>` and reach the database through
`db(&ctx)`. Bodies are `application/json` with camelCase keys. Routes are
declared with `axa::routes::Routes` and collected in `App::routes`.

Every failed request answers RFC 9457 `application/problem+json`, whichever layer
failed it: `axa::Error`, an extractor, an unknown route, a wrong method, an oversized
body, a panic, or a timeout. `axa` writes all of these itself, so a handler keeps
returning `axa::Result`. Return an `Error` rather than a `(StatusCode, "why")` pair,
whose text would be dropped.

```json
{"type": "about:blank", "title": "Bad Request", "status": 400, "detail": "offset 100001 exceeds the maximum of 100000", "code": "bad_request"}
```

`detail` carries the text of `Error::BadRequest` and `Error::CustomError`, so treat
that text as public. `support/prelude.rs` exports `axa::extract::{Json, Path, Query}`
in place of Axum's, so a refused request says what was wrong and quotes nothing. A
violated unique or foreign key constraint answers `409`, a violated CHECK or NOT NULL
constraint answers `422` (axa 0.6.2 and later), and a `500` has no `detail`.
Health routes under `/_` keep their own bodies.

List routes take `OriginalUri(uri): OriginalUri`, and use `cursor_page(&ctx, &uri)?`,
`page.bounds()` in the model, and `page.respond(rows)`. `PAGE_LIMITS`, `cursor_key`
and `cursor_page` are in `support/mod.rs`, and `App::context` stores the key in
`ctx.shared_store`. A list answers a bare array, never an `{items, total}` envelope,
and there is no total.

`App::router` limits each client to `RATE_LIMIT_REQUESTS` (600) in each
`RATE_LIMIT_WINDOW_SECONDS` (60), both in `support/mod.rs`, with
`axa::ratelimit::by_client`. The layer goes on the routes before
`axa::middleware::apply`, so it runs inside the standard stack, after the client's
address is worked out. Past the limit a client gets a `429` problem with
`Retry-After` and the `RateLimit-*` headers. `/_ping`, `/_health`, and `/_readiness`
are never limited. Each process counts for itself, and behind a proxy
`TRUSTED_PROXIES` must list it.

## Commands

```sh
cargo run -- start            # Start the server (default port 5150)
cargo run -- start --all      # Start the server and the job worker
cargo build                   # Development build
cargo test                    # Run all tests (needs PostgreSQL)
cargo clippy --all-targets    # Lint checks
cargo fmt                     # Format code

# Migrations (from the crate root)
cargo run -- db migrate       # Apply pending migrations
cargo run -- db down          # Revert the newest migration
cargo run -- db status        # Show which migrations have run
AXA_DESTROY_DATA=true cargo run -- db reset   # Drop everything and migrate again
cargo run -- task seed        # Load the fixtures (development and test only)
```

## Configuration

Settings come from the environment, with defaults in `defaults()` in `app.rs`:

- `APP_ENV` — `development`, `test`, or `production`
- `PORT`, `BINDING`, `HOST` — where to listen (default port 5150)
- `DATABASE_URL` — PostgreSQL connection string. Required in production
- `DB_MIN_CONNECTIONS`, `DB_MAX_CONNECTIONS`, `DB_CONNECT_TIMEOUT`, `DB_IDLE_TIMEOUT`
- `CORS_ALLOWED_ORIGINS` — off in production until origins are listed
- `LOG_LEVEL`, `LOG_FORMAT`, `LOG_FILTER`
- `WORKER_MODE`
- `SHUTDOWN_TIMEOUT_SECONDS` — how long requests and jobs get to finish (default 25)
- `CURSOR_KEY` — the secret, at least 32 bytes, that signs list cursors; the same on every
  replica, and required where the environment is production-like
- `TRUSTED_PROXIES` — the proxies whose `X-Forwarded-For` is believed, so that the rate
  limit counts each client rather than the proxy

## Access control

The crates have no authentication and no authorization, so every route is open to
whoever can reach it. There is no `users` table. Put the API behind your own
access control before it holds real data.

## Lists

A list route takes `?limit=` (default 100, largest 1000) and an opaque `?cursor=`,
through axa's `cursor-pagination`. While more rows follow, the response carries
`Link: <...>; rel="next"`, and a client reads every page by following it. There is no
total and no `?offset=`: a total would count rows a caller may not be allowed to see.
A cursor is signed with HMAC-SHA256 over its position, the path and every filter, so
a caller cannot forge one, edit one, or carry it to another list or filter. A bad
cursor, or a `limit` that is zero, not a number, or over 1000, answers `422`; a limit
is refused, never clamped. Rows come back in a stable order.

The key is `CURSOR_KEY`, at least 32 bytes, and every replica must share it. A
production-like environment refuses to start without it. Development and test fall
back to a public key in the source. Changing the key invalidates the cursors already
handed out, which then answer `422`.

## Destructive commands

`db down`, `db reset`, and `db truncate` are refused on the command line unless the
process runs in development or test and `AXA_DESTROY_DATA` is `true`. `axa::cli::parse`
refuses them before the service runs anything, and `--environment` cannot lift it.
`App::db` refuses them in production as well, for a call that arrives any other way.
`task seed` is development only: outside development and test it is refused, so
fixtures cannot reach real records.

## Background queue

Jobs run on axa's Postgres queue (`FOR UPDATE SKIP LOCKED`), in the `axa_queue`
table, created on connect. `start` alone runs only the server; use `start --all`
or `start --worker` to run jobs. Delivery is at least once.

## Database

The default URL is `postgres://postgres:postgres@localhost:5432/<form_snake_case>_<env>`,
axa's local default, so a local setup needs a `postgres` role with that password.
Run `forms/<slug>/back-end-with-axum-setup` to create the three databases and apply
the migrations. Run `cargo run -- check` to print the effective settings, with
secrets redacted, without connecting to anything.

`/_readiness` answers 503 and names what failed when the database or the queue
stops answering; each crate adds the database check in `App::context`. `/_health`
only says the process is up.

For database naming, always use the full form name, never use an abbreviation or
truncation.

## Supply-chain policy (cargo-deny)

Every crate carries a `deny.toml` generated by `bin/generate-axum-deny-config.py`
(`--check` is the CI drift detector). One policy applies verbatim across the
corpus; a documented ignore entry with a reason covers each unfixable transitive
advisory.

```sh
cd back-end-with-axum && cargo deny --all-features check
```

## Cargo.lock is tracked

Every crate's `Cargo.lock` is committed, because each is a binary crate. See
[`../spec/cargo-lock-tracking.md`](../spec/cargo-lock-tracking.md).

## Fleet-wide maintenance tools

- `bin/generate-axum-deny-config.py [--check] [<slug>…]` — write each crate's `deny.toml`
- `bin/axum-forbid-unsafe [--check] [--dry-run] [--verbose] [--all|<slug>…]` — add `#![forbid(unsafe_code)]` to each crate root
- `bin/axum-msrv-set --msrv <version> [--check] [--dry-run] [--all|<slug>…]` — set the Rust MSRV fleet-wide
- `bin/axum-axa-upgrade [--check] [--root <dir>] [--all|<slug>…]` — move crates from axa 0.5 to 0.6, whose errors are RFC 9457 problems, and check they stay there
- `bin/axum-axa-adopt [--check] [--root <dir>] [--all|<slug>…]` — take up axa 0.6's per-client rate limit and development-only `seed` task; `--check` also fails a list that skips `Page::respond`
- `bin/axum-axa-0-7 [--check] [--no-lock] [--root <dir>] [--all|<slug>…]` — move from axa 0.6 to 0.7: the `offset-pagination` feature and the `axa::offset_pagination` path, the new names of `pagination`, and `cargo update -p axa`
- `bin/axum-axa-0-8 [--check] [--no-lock] [--root <dir>] [--all|<slug>…]` — move from axa 0.7 to 0.8: the axa line, and `cargo update -p axa -p axa-cursor-pagination`, so nothing else in the lock moves. No source changes; only the unused `outbox` feature breaks
- `bin/axum-axa-0-9 [--check] [--no-lock] [--root <dir>] [--all|<slug>…]` — move from axa 0.8 to 0.9: the axa line, and `cargo update -p axa -p axa-worker`. No source changes: what 0.9 breaks (offset paging, idempotency's `lease`, the queue's `cancel` and `retry`) is unused here
- `bin/axum-cursor-pagination [--check] [--root <dir>] [--all|<slug>…]` — page every generated list by signed cursor instead of offset: `cursor_key` and `cursor_page` in `support/`, lists read the URI, models drop their `COUNT(*)`, tests follow `Link`; `--check` also names a hand-written list still paging by offset
- `bin/axum-check-constraints [--check] [--root <dir>] [--all|<slug>…]` — migrate every `sql/` CHECK constraint the crate's tables can hold, `NOT VALID`, and write the `build.rs` that rebuilds when `migrations/` changes. Run after changing `sql/`, then run `bin/axum-fixture-checks`
- `bin/axum-fixture-checks [--check] [--all|<slug>…]` — put an allowed value wherever a fixture or a test's literal `INSERT` breaks a CHECK constraint; needs Postgres
- `bin/axum-entity-routes [--check] [--root <dir>] [--all|<slug>…]` — give every `sql/` table a migration, model, controller, and test, unless a hand-written controller already reaches it. Run after adding a table, then run `bin/axum-soft-delete`
- `bin/axum-soft-delete [--check] [--root <dir>] [--all|<slug>…]` — make `DELETE` mark and cascade, make reads and updates skip marked rows, narrow uniqueness to live rows, and take `deleted_at` out of every body
- `bin/test-axum-routes` — assert every crate exposes its domain HTTP API
- `bin/generate-api-transcripts [--check] [<slug>…]` — record a real `examples/api-create.http` transcript
- `bin/back-end-with-axum/migrate-from-loco/` — the shared `support/` source, and a record of the one-shot conversion from Loco and SeaORM. The conversion predates ADR-7, so it still emits auth

## Verify

```sh
for d in forms/*/back-end-with-axum; do
  (cd "$d" && cargo test) || echo "FAIL: $d"
done
```
