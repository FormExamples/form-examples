# Back-end with Rust axum Loco

Server-side Rust JSON API using the Loco framework. There is **no HTML
rendering layer** — no Tera templates, no HTMX, no Alpine.js, no Lily
Design System, no CSS, no static assets. The crate is a pure back-end
that exposes JSON endpoints consumed by the separate `front-end-*-with-html/`
and `front-end-*-with-svelte/` subprojects. The contract each form's
back-end must satisfy is documented in the per-form
`forms/<slug>/spec/index.md`; the system-wide back-end rules live in
[`../spec.md`](../spec.md) §6.

Slug: back-end-with-loco

- Search pattern: `forms/*/back-end-with-loco`

## Technology stack

| Component                                           | Version          | Purpose                                          |
| --------------------------------------------------- | ---------------- | ------------------------------------------------ |
| [Rust](https://rust-lang.org/)                      | 1.96+ (ed. 2024) | Systems programming language                     |
| [axum](https://crates.io/crates/axum)               | 0.8              | Web application framework                        |
| [Loco](https://loco.rs/)                            | 1.0.1            | Rails-like framework on axum                     |
| [SeaORM](https://www.sea-ql.org/SeaORM/)            | 2.0              | Object relational mapper                         |
| [PostgreSQL](https://www.postgresql.org/)           | 18.3             | Database server                                  |
| [serde](https://serde.rs/)                          | 1.x              | Serialization with `rename_all = "camelCase"`    |
| [uuid](https://crates.io/crates/uuid)               | 1.24             | UUIDv4 primary keys                              |
| [tokio](https://tokio.rs/)                          | 1.53             | Async runtime (rt-multi-thread)                  |
| [chrono](https://crates.io/crates/chrono)           | 0.4              | Timestamps with serde support                    |
| [Assertables](https://crates.io/crates/assertables) | 9.8              | Assertion testing macros                         |
| [Criterion](https://crates.io/crates/criterion)     | 0.8.2            | Benchmarks                                       |
| [Tantivy](https://crates.io/crates/tantivy)         | 0.26.1           | Full-text search engine                          |
| [opentelemetry](https://crates.io/crates/opentelemetry)             | 0.27 | Vendor-neutral observability API           |
| [opentelemetry_sdk](https://crates.io/crates/opentelemetry_sdk)     | 0.27 | OpenTelemetry SDK (metrics + tracing)      |
| [opentelemetry-otlp](https://crates.io/crates/opentelemetry-otlp)   | 0.27 | OTLP gRPC/HTTP exporter to a collector     |
| [tracing-opentelemetry](https://crates.io/crates/tracing-opentelemetry) | 0.28 | Bridge `tracing` spans → OpenTelemetry  |
| [axum-prometheus](https://crates.io/crates/axum-prometheus)         | 0.7  | Prometheus `/metrics` endpoint for axum    |

Removed (no longer in the stack):

- [Tera](https://keats.github.io/tera/) — server-side template engine
- [HTMX](https://htmx.org/) — AJAX navigation via `hx-boost`
- [Alpine.js](https://alpinejs.dev/) — client-side conditional fields
- [Lily Design System](https://github.com/joelparkerhenderson/lily-design-system) — class vocabulary
- Static CSS / asset bundle

## Loco

Create app (note `--assets none` — no static asset bundle):

```sh
loco new --name [form] --db postgres --bg pg --assets none
```

The `--bg pg` flag selects the **Postgres-backed background queue**. Loco's
SQLite-backed (`bg_sqlt`) and Redis-backed (`bg_redis`) queues are
**not** used in this monorepo — every back-end runs on Postgres, so we keep
exactly one queue backend and drop the others (see [Background queue](#background-queue)).

Create cargo dependencies:

```sh
cargo add loco@0
cargo add axum@0
cargo add SeaORM@1.1
cargo add PostgreSQL@18
cargo add serde@1
cargo add uuid@1
cargo add tokio@1
cargo add chrono@0
cargo add assertables@10
cargo add criterion@0
cargo add tantivy@0
```

Create scaffold:

```sh
cargo loco generate scaffold [model] [field]:[type] [field]:[type] [field]:[type]
```

## Crate layout

Each form's back-end crate is a Cargo workspace with a `migration` sub-crate:

Route layout: all crate source lives under `src/<form_snake_case>/`; the crate
root (Cargo.toml, config/, migration/, tests/) stays at `back-end-with-loco/`.

```txt
back-end-with-loco/
  Cargo.toml                  # Workspace + package manifest; [lib] path + [[bin]] path point into src/<form_snake_case>/
  .gitignore                  # ignore /target, /node_modules, etc.
  src/
    <form_snake_case>/        # All crate source nested here (route layout)
      bin/
        main.rs               # Single binary — runs both the HTTP server and the Loco management CLI
      lib.rs                  # Crate root ([lib] path = src/<form_snake_case>/lib.rs)
      app.rs                  # Loco App trait impl
      controllers/            # axum handlers per resource (JSON in, JSON out)
      engine/                 # Pure scoring / grading engine
      models/                 # SeaORM active-model wrappers + domain logic
      tasks/                  # Loco background tasks (optional)
      workers/                # Loco workers (optional)
  config/
    development.yaml          # Loco development config
    test.yaml                 # Loco test config
    production.yaml           # Loco production config
  migration/                  # SeaORM migration crate
    src/
      lib.rs
      m*.rs                   # Migration files
  tests/                      # Integration tests for the engine and JSON API
```

Note: `include_dir!("src/...")` / `include_str!` literals in the source are
crate-root-relative, so they must reference `src/<form_snake_case>/...`.

There is no `templates/` and no `assets/`. (Loco's `src/views/` holds JSON
response shapers only — never HTML.)

## Back-end pattern

- Loco framework with axum routing.
- Rust scoring engine mirrors the spec's algorithm; structs shared with
  the front-end use `serde(rename_all = "camelCase")`.
- SeaORM entities target PostgreSQL 18.
- Every response carries `Content-Type: application/json; charset=utf-8`.
- 4xx responses are JSON error envelopes (`{"error": "...", "details": ...}`).
- No HTML, no Tera context building, no template rendering, no CDN scripts.

## JSON API contract

Every form's controller exposes the same canonical resource at `/api/assessments`:

| Method | Route                          | Handler              | Purpose                                                  |
| ------ | ------------------------------ | -------------------- | -------------------------------------------------------- |
| GET    | `/api/assessments`             | `list_assessments`   | List assessments (filterable via query params)           |
| POST   | `/api/assessments`             | `create_assessment`  | Create a new draft assessment, return `{id, data}`       |
| GET    | `/api/assessments/{id}`        | `show_assessment`    | Return the assessment record as JSON                     |
| PATCH  | `/api/assessments/{id}`        | `update_assessment`  | Merge a partial body into the JSONB `data` column        |
| POST   | `/api/assessments/{id}/submit` | `submit_assessment`  | Run the grading engine, persist the result, return JSON  |
| GET    | `/api/assessments/{id}/result` | `show_result`        | Return the stored grading result as JSON                 |

Request and response bodies are `application/json`. The on-the-wire shape
uses camelCase keys via `serde(rename_all = "camelCase")`. There is no
form-encoded body parsing, no redirect responses, no Tera context building.

Every crate also serves `GET /api/openapi.yaml` — this form's combined
`OpenAPI` 3.1 spec (`openapi/combined/openapi.yaml`, generated by
`bin/openapi/generate-openapi-combined.py`), embedded at compile time via
`include_str!` and returned through Loco's own `format::yaml()` helper.
Rolled out mechanically by `bin/loco-serve-openapi-refactor`
(`--check` is its CI drift detector); 349/355 crates done as of
2026-09-09.

Every domain controller `Params` struct and domain entity `Model` struct
carries `#[serde(rename_all = "camelCase")]` — the `cargo loco generate
scaffold` output never adds this on its own, so a form built straight from
the scaffold serves/accepts snake_case until this attribute is added.
Rolled out mechanically by `bin/loco-camel-case-json-refactor`
(`--check` is its CI drift detector); 346/355 crates changed 2026-09-09 (9
already had full coverage). Never applied to the Loco-scaffolded
`auth.rs`/`users.rs`, which stay on Loco's own default shape.

## Commands

```sh
cargo loco start              # Start development server (default port 5150)
cargo build                   # Development build
cargo build --release         # Production build
cargo test                    # Run all tests
cargo clippy                  # Lint checks
cargo fmt                     # Format code

# Migrations (from the crate root)
cargo loco db migrate         # Apply pending migrations
cargo loco db reset           # Reset the database
cargo loco db seed            # Seed sample data
```

## Configuration

Environment variables for production:

- `PORT` — server port (default 5150)
- `HOST` — server host URL
- `DATABASE_URL` — PostgreSQL connection string
- `FRONTEND_URL` — allowed CORS origin
- `OTEL_EXPORTER_OTLP_ENDPOINT` — OTLP collector endpoint (e.g. `http://otel-collector:4317`)
- `OTEL_SERVICE_NAME` — overrides the default service name (defaults to the form slug)

## Background queue

Every Loco crate uses the **Postgres-backed** background queue and **only**
the Postgres-backed queue. The SQLite-backed (`bg_sqlt`) and Redis-backed
(`bg_redis`) backends are disabled to keep the runtime footprint identical
to the primary datastore (no extra service to operate, no second source of
truth for job state).

### Cargo.toml

In every form's Loco crate `Cargo.toml`, declare `loco-rs` with
`default-features = false` and enable only the features actually used. The
`bg_pg` feature is required; `bg_sqlt` and `bg_redis` MUST NOT appear:

```toml
loco-rs = { version = "0.16", default-features = false, features = [
  "auth_jwt",
  "bg_pg",        # Postgres-backed background queue (REQUIRED)
  "cache_inmem",
  "cli",
  "with-db",
] }
```

Forbidden features (drift detector flags these):

- `bg_sqlt` — SQLite-backed queue (not used)
- `bg_redis` — Redis-backed queue (not used)

### YAML config

`config/development.yaml`, `config/test.yaml`, and `config/production.yaml`
all carry a `workers:` block (`BackgroundQueue` in development/production,
`ForegroundBlocking` in test) and a `queue:` block
pointing at Postgres. Reuse the same Postgres URI as the main `database:`
block — Loco creates its own `loco_jobs` table on first start.

`config/development.yaml`:

```yaml
workers:
  mode: BackgroundQueue

queue:
  kind: Postgres
  uri: postgres://postgres:postgres@localhost:5432/[form]_development
  dangerously_flush: false
  num_workers: 2
```

`config/test.yaml` (note **ForegroundBlocking** — the test environment runs
queued jobs inline so the starter's mailer tests execute synchronously and
stay green):

```yaml
workers:
  mode: ForegroundBlocking

queue:
  kind: Postgres
  uri: postgres://postgres:postgres@localhost:5432/[form]_test
  dangerously_flush: true
  num_workers: 1
```

`config/production.yaml`:

```yaml
workers:
  mode: BackgroundQueue

queue:
  kind: Postgres
  uri: '{{ get_env(name="DATABASE_URL") }}'
  dangerously_flush: false
  num_workers: 4
```

## Observability

Every Loco crate emits **OpenTelemetry metrics + traces over OTLP** and
exposes a **Prometheus `/metrics` endpoint** on the same axum router. The
two are complementary:

- **OTLP exporter** → ships metrics + traces to an external OpenTelemetry
  collector for centralised aggregation (Tempo, Jaeger, Mimir, …).
- **`/metrics` endpoint** → in-process Prometheus scrape target for local
  development and Prometheus-native deployments.

### Cargo.toml

```toml
opentelemetry            = "0.27"
opentelemetry_sdk        = { version = "0.27", features = ["rt-tokio", "metrics"] }
opentelemetry-otlp       = { version = "0.27", features = ["grpc-tonic", "metrics", "trace"] }
tracing-opentelemetry    = "0.28"
axum-prometheus          = "0.7"
```

### Initializer

Each crate wires a `src/initializers/observability.rs` Loco `Initializer`
that:

1. Builds an OTLP `SpanExporter` and `MetricExporter` from
   `OTEL_EXPORTER_OTLP_ENDPOINT` (defaults to `http://localhost:4317`).
2. Sets the global `TracerProvider` and `MeterProvider`, tagged with
   `service.name = OTEL_SERVICE_NAME` (defaulting to the form slug).
3. Layers the `tracing-opentelemetry` `OpenTelemetryLayer` onto the
   existing `tracing-subscriber` so every Loco/axum span is exported.
4. Mounts `axum-prometheus`'s `PrometheusMetricLayer` and registers a
   `GET /metrics` route that returns the Prometheus text format.

### `/metrics` endpoint

- Path: `/metrics`
- Method: `GET`
- Format: Prometheus text (`text/plain; version=0.0.4`)
- Unauthenticated by default; production deployments restrict access at
  the ingress / network-policy level.
- Excluded from the standard CORS allow-list.

`bin/loco-config-refactor` is the drift detector for the background-queue
and observability conventions — it edits `Cargo.toml` and `config/*.yaml`
in place and exits non-zero in `--check` mode if anything is missing.

## Database

### Development database

Development database name is [form]\_development snake case; example patient_intake_development

File `config/development.yaml`:

```yaml
database:
  uri: postgres://postgres:postgres@localhost:5432/[form]_development
```

### Test database

- Test database name is [form]\_test snake case; example patient_intake_test

File `config/test.yaml`:

```yaml
database:
  uri: postgres://postgres:postgres@localhost:5432/[form]_test
```

### Production database

- Production database name is [form]\_production snake case; example patient_intake_production
- Connection string is supplied via `DATABASE_URL`; never hard-code credentials

File `config/production.yaml`:

```yaml
database:
  uri: '{{ get_env(name="DATABASE_URL") }}'
```

### Database naming

For database naming, always use the full form name, never use an abbreviation or truncation.

## Supply-chain policy (cargo-deny)

Every crate carries a `deny.toml` — advisories, license allow-list, banned
crates, and source registries — generated by
`bin/generate-loco-deny-config.py` (`--check` is the CI drift detector for
the file's own content). Because every crate shares the same `loco-rs` 0.16
pin, one policy applies verbatim across the whole corpus; a documented
`[[advisories.ignore]]` entry with a reason covers each unfixable transitive
advisory (unmaintained crates, or a vulnerability class this crate's code
path never reaches). Run with `--all-features` so features gated behind
Cargo feature flags are included in the graph that's checked:

```sh
cd back-end-with-loco && cargo deny --all-features check
```

This runs in CI as part of the sharded Rust job, per crate, alongside
`cargo check` / `cargo clippy` / `cargo test` (see
[Verification](../docs/verification.md)).

## Cargo.lock is tracked

Every crate's `Cargo.lock` is committed — it's a binary crate (the Loco
app + management CLI), not a published library, so the standard "commit
the lockfile for binaries" guidance applies. This also makes the
supply-chain policy above reproducible: an untracked lockfile would let
CI resolve different transitive versions than a contributor's machine,
making an advisory or license finding appear or vanish with no code
change. `.gitignore` must carry `!Cargo.lock` (or no `Cargo.lock` rule at
all), never a bare `Cargo.lock` ignore line. See
[`../spec/cargo-lock-tracking.md`](../spec/cargo-lock-tracking.md).
`bin/loco-config-refactor [--all|<slug>] [--check]` fixes `.gitignore`
mechanically alongside its background-queue and observability conventions
(above).

## Fleet-wide maintenance tools

Mechanical tools that keep every Loco crate on the current fleet
convention. Each has a `--check` mode used as a CI drift detector (see the
root [`AGENTS.md`](../AGENTS.md) Verify block for the full command list).

- `bin/loco-config-refactor [--check] [--dry-run] [--all|<slug>]` — mechanical Loco crate refactor for the canonical background-queue (Postgres only; drops `bg_sqlt` / `bg_redis`) and observability (OpenTelemetry + Prometheus `/metrics`) conventions; `--check` is the CI drift detector
- `bin/loco-migration-defaults [--check] [--dry-run] [--verbose] [--all|<slug>…]` — mirror each form's `sql/` column defaults into its `back-end-with-loco/migration/` as `ColType::*WithDefault`. `cargo loco generate scaffold` cannot express defaults, so every generated migration drops them and the back-end schema silently disagrees with `sql/`, its own source of truth; re-run after any re-scaffold. `--check` is the CI drift detector
- `bin/loco-migration-nullability [--check] [--dry-run] [--verbose] [--all|<slug>…]` — restore each form's `sql/` column nullability across the migration, the entity, and the controller's `Params` (all three must move together). Loco has no nullable-unique `ColType`, so `StringUniq` forced nullable UNIQUE columns such as `united_kingdom_nhs_number` to `NOT NULL UNIQUE` — which admits only **one** row without the identifier, the rest colliding on `''`. Uniqueness is re-expressed as an explicit unique index. `--check` is the CI drift detector
- `bin/generate-loco-deny-config.py [--check] [<slug>…]` — write each Loco crate's `deny.toml` (cargo-deny advisories/licenses/bans/sources policy); `--check` is the CI drift detector. Run `cargo deny --all-features check` from inside a crate to execute the policy
- `bin/loco-forbid-unsafe [--check] [--dry-run] [--verbose] [--all|<slug>…]` — add `#![forbid(unsafe_code)]` to every crate root in each form's `back-end-with-loco/`: the library, the `-cli` binary, the `migration` library, and the integration-test target (four per form; the attribute is per crate root, not per file). Nothing in these crates needs `unsafe`, and `forbid` — unlike `deny` — cannot be reopened by a later inner `allow`. `cargo loco generate scaffold` does not emit the attribute, so each form's generated `back-end-with-loco-setup` script calls this tool as its final step; `--check` is the CI drift detector
- `bin/loco-seed-base-rename [--check] [--dry-run] [--all|<slug>…]` — rename the unused `base` param in every crate's `App::seed()` to `_base`. `loco new` scaffolds `seed(ctx: &AppContext, base: &Path)` and never uses `base` (fixtures load via `env!("CARGO_MANIFEST_DIR")` instead), so `cargo clippy --all-targets -- -D warnings` failed 346/355 crates — a fleet-wide, CI-breaking scaffold bug discovered when CI's Rust job was checked and found to have never gone green. `back-end-with-loco-setup` calls it as a final step so a newly scaffolded crate is never affected; `--check` is the CI drift detector
- `bin/loco-seed-base-stray-usage-fix [--check] [--dry-run] [--all|<slug>…]` — one-shot: remove the stray `let _ = base;` left in 11 forms' `App::seed()` by the route-nesting-layout fixture move, which predated (and was never updated by) `bin/loco-seed-base-rename`'s parameter rename above — once the parameter became `_base`, the leftover body reference to `base` turned from silencing a lint into a hard `E0425` compile error. Found via a real, verified CI run (Rust shard 5/8 failing to compile `dietic_assessment`), not a local guess. `--check` is a completeness/regression gate, not a routine CI drift detector — no generator produces this stray line
- `bin/loco-test-auth-header-fix [--check] [--dry-run] [--all|<slug>…]` — drop the redundant `&` in every crate's test `auth_header()` helper (`format!("Bearer {}", &token)` where `token: &str` is already a reference). Same `loco new` scaffold-bug class as `loco-seed-base-rename`, found alongside it (346/355 crates); wired into the same setup-script step; `--check` is the CI drift detector
- `bin/loco-rs-1-migration [--check] [--dry-run] [--all|<slug>…]` — one-shot loco-rs 0.16 → 1.0.1 major-version migration: `Cargo.toml`/`migration/Cargo.toml` version bumps, the `auth_jwt`/`bg_pg` → `auth`/`worker` feature rename, and every `id`/`*_id` entity, controller `Params`, `Path<i32>`, and hand-written helper moved `i32` → `i64` (loco-rs 1.0's `ColType::PkAuto` now renders `BIGINT`). Applied fleet-wide 2026-08-02; `--check` confirms no crate is still on 0.16
- `bin/loco-msrv-set --msrv <version> [--check] [--dry-run] [--all|<slug>…]` — set the Rust MSRV fleet-wide, per [`spec/rust-msrv-n-minus-2/`](../spec/rust-msrv-n-minus-2): the current stable release minus two minor versions (stable 1.98 → MSRV 1.96 as of 2026-08-29). The spec's `[workspace.package]` + `rust-version.workspace = true` pattern is applied per-form, since each `back-end-with-loco/` is its own self-contained workspace (no repo-root one exists) — `migration/` is confirmed a member of that same implicit workspace via its `loco-rs = { workspace = true }` dependency. Re-run with a new `--msrv` whenever stable Rust advances, per the spec's "Maintenance" section; `--check` is the CI drift detector, and the `msrv` CI job (`dtolnay/rust-toolchain@1.96`, `cargo check --all-targets --workspace`, sharded like `rust`) verifies the code actually compiles on it, not just that the field is set
- `bin/loco-test-max-connections-fix [--check] [--dry-run] [--all|<slug>…]` — raise every crate's `config/test.yaml` `max_connections` default from the scaffold's `1` to `10`. Paired with the default 500ms `connect_timeout`, a pool of exactly one connection races `cargo test`'s default multi-threaded concurrency: the moment two DB-touching tests in one crate run at once, the loser blocks behind the winner's single connection and times out (`SqlxError(PoolTimedOut)`) — a real, deterministic race, not unexplained flakiness, though the failure itself is intermittent. Found via a real, verified CI run (the nightly full-matrix sweep's Rust shard 3/8 failing 2 of `hearing-test-request`'s 35 tests this way). `--check` is the CI drift detector
- `bin/loco-serve-openapi-refactor [--check] [--dry-run] [--all|<slug>…]` — add a `GET /api/openapi.yaml` route to every Loco crate, serving that form's combined `openapi/combined/openapi.yaml` (the "Serve OpenAPI" half of the two-part item; `bin/openapi/generate-openapi-combined.py` is the "Combined OpenAPI spec" half). Reference implementation: `medical-operation-note`. A byte-identical `controllers/openapi.rs` `include_str!`s the spec at compile time and serves it via Loco's own `format::yaml()` helper; wired into each crate via `pub mod openapi;` in `controllers/mod.rs` and `.add_route(crate::controllers::openapi::routes())` in `app.rs`, both mechanical insertions after existing anchor lines. 349/355 crates done fleet-wide 2026-09-09 (6 skipped — no `pub mod auth;` anchor to insert after). Verified live: `cargo check`/`cargo clippy -- -D warnings` clean on a diverse 6-crate sample, `cargo test` green on 2, and a real `curl` against a running server on 2 more returned the exact YAML byte-for-byte. `--check` is the CI drift detector
- `bin/loco-camel-case-json-refactor [--check] [--dry-run] [--all|<slug>…]` — fixes the fleet's former "API serves snake_case, not camelCase" contract mismatch: adds `#[serde(rename_all = "camelCase")]` to every domain controller `Params` struct (`controllers/<table>.rs`, skipping the scaffolded `auth.rs` and the `openapi.rs` above) and domain entity `Model` struct (`models/_entities/<table>.rs`, skipping the scaffolded `users.rs`) so the JSON API actually emits/accepts camelCase — matching the repo's own convention and every front-end's already-camelCase requests. Never touches `auth.rs`/`users.rs`. Reference implementation: `medical-operation-note`. Scope came in narrower than the original finding's "283 crates + ~1400 insta-snapshot regen" estimate: every crate's only real (non-stub) `assert_debug_snapshot!` calls live in the Loco-scaffolded `tests/models/users.rs`/`tests/requests/auth.rs`, and every domain `tests/models/<table>.rs` is an unfilled 31-line scaffold stub fleet-wide (0 exceptions), so this fix needed no snapshot regen. It did need updating the fleet's only 2 hand-written, non-stub `tests/requests/*.rs` files whose assertions were keyed to the old snake_case wire format (`apgar-score`'s `patients.rs`, `architecture-decision-record`'s `architecture_decision_record.rs`), fixed by hand alongside this tool. 346/355 crates changed 2026-09-09 (9 already had full camelCase coverage). `--check` is the CI drift detector
- `bin/loco-integration-test-rollout [--check] [--dry-run] [--all|<slug>…]` — Phase 1 of tasks.md's "Loco API integration test rollout": upgrades every crate's scaffold-stub `tests/requests/patient.rs` (a bare "GET list returns 200" check) into a real POST-then-GET-then-list round-trip test, mirroring the `apgar-score` reference. Scoped to the `patient` table specifically (present in 336/356 crates), not literally every table — a direct fleet check found the `patient` `Params` struct is NOT byte-identical fleet-wide (8+ distinct variants: some carry a `sex` CHECK-enum, some carry fitness/vitals fields, some carry `deleted_at` in `Params`), so this is a genuine per-crate generator: it parses each crate's own `Params` field list (name + Rust type) from the Rust source, cross-references `sql/*create_table_patient.sql`'s CHECK constraints for realistic enum values (mirroring `examples/assessment.json`'s own "first non-empty allowed value" convention), and falls back to small field-name heuristics (email, phone, postcode, NHS number, MRN, height/weight/BMI, …) or a generic per-Rust-type placeholder. All 336/336 patient-bearing crates now covered (323 in the initial 2026-09-11 pass; the other 9, initially SKIPped for having no test stub at all, gained one from `bin/loco-missing-request-test-stubs-fix` below and were swept up by a second run of this tool the same day — `--check` confirms 0 pending, 20 SKIP being the crates with no `patient` table at all). Verified: `cargo check`/`cargo clippy --all-targets -D warnings` clean on a diverse sample spanning the `Params`-variant spread plus no-`patient`-table/no-stub crates (confirmed correctly unaffected), `cargo test` green with a live scratch Postgres on 8 crates total across both passes. Extending this to other domain tables (the form's own main table, clinician, grade/grade_rule/grade_flag) is separate, future scope — those have far more per-form-specific shapes (FK chains, bespoke enum vocabularies) than a generic value-picker can safely guess. `--check` is the CI drift detector
- `bin/loco-seed-data-rollout [--check] [--dry-run] [--all|<slug>…]` — implements tasks.md's "Loco seed data: per-crate seeder loading `examples/` typical fixture; document `cargo loco db seed`". Every scaffolded crate ships an empty (or `users`-auth-table-only) `App::seed()`; this tool discovers each crate's domain tables from `models/_entities/*.rs`, parses each `Model` struct's fields, detects foreign keys (a column typed to match another discovered table's own PK type and named `<table>_id`), topologically sorts the tables, and emits one deterministic-id YAML fixture per table plus a `db::seed::<T>()` call sequence inserted into the *existing* `seed()` body (never replacing whatever it already seeds). A fleet survey done before generalising overturned this repo's own prior assumption that the fleet was uniformly UUID-keyed (per the relational-schema convention): only 2/338 crates (`cardiology-request`, `cardiology-response`) use a `Uuid` PK — the other 336 use the scaffold's `i64` auto-increment default, which the source-of-truth `sql/` never specifies (it's always `UUID`) — so both a `det_uuid()` and a `det_int_id()` path are generated depending on each table's actual PK type; a nullable FK column is left `null` rather than guessed at. 352/356 crates changed 2026-09-12 (3 already migrated, 1 SKIP: `united-kingdom-statement-of-fitness-for-work`'s main-table entity carries a genuinely self-referential `..._id` column with no matching SQL/`is_duplicate_of` column — a real, separate, pre-existing entity-generation bug, flagged not fixed here). Verified live against a real scratch Postgres (`cargo loco db migrate` + `db seed --from src/fixtures`, both PK-type paths, the `users`-preserving insertion, and the auto-increment sequence reset) on 6 structurally diverse crates, plus `cargo check` clean fleet-wide. `--check` is the CI drift detector
- `bin/loco-missing-request-test-stubs-fix [--check] [--dry-run] [--all|<slug>…]` — one-shot: scaffolds the missing domain `tests/requests/<table>.rs` stub for every crate found (direct fleet check, 2026-09-11) to have NO domain request test stubs whatsoever — only `auth.rs`/`prepare_data.rs` wired in `tests/requests/mod.rs`, despite every domain controller existing and being routed. `cargo loco generate scaffold` normally emits one such stub per table as a side effect; these 9 crates (`cataract-diagnostic-evaluation`, `dietic-assessment`, `health-screening-questionnaire`, `hernia-diagnostic-evaluation`, `hip-replacement-surgery-evaluation`, `inpatient-clinical-note`, `knee-replacement-surgery-evaluation`, `medical-operation-note`, `perioperative-optimization`) never got it — built via an earlier/different process, before the convention was consistently applied. For each domain controller (skipping `auth.rs`/`openapi.rs`/`mod.rs`), reads that controller's own `routes()` function for its real mounted route prefix (`.prefix("api/<plural>/")`) rather than re-deriving English pluralization independently (allergy → allergies, not allergys) — Loco's own inflector already decided this once; parsing the same source is more reliable than reimplementing it. Writes the fleet's standard scaffold-stub test (already carrying the trailing-slash/content-type fix applied fleet-wide earlier) and adds `pub mod <table>;` to `tests/requests/mod.rs`. 9 crates, 68 files added. Verified: `cargo check`/`cargo clippy --all-targets -D warnings` clean on all 9, `cargo test` green with a live scratch Postgres on 4 (54, 43, 43, 33 tests respectively, 0 failed). `--check` is a completeness/regression gate, not a routine CI drift detector — no generator produces this stub set automatically, so nothing should ever re-trigger it once fixed

## Verify

```sh
for d in forms/*/back-end-with-loco; do
  (cd "$d" && cargo build && cargo test) || echo "FAIL: $d"
done
```
