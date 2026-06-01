# Full-stack with Rust axum Loco HTMX Alpine.js

Server-rendered Rust web application using the Loco framework with Tera
templates, HTMX for dynamic page updates, and Alpine.js for light client-side
interactivity. The contract each form's backend must satisfy is documented
in the per-form [`spec.md`](../forms/AGENTS.md); the system-wide backend
rules live in [`../spec.md`](../spec.md) §6.

Slug: full-stack-with-loco-tera-htmx-alpine

- Search pattern: `forms/*/full-stack-with-loco-tera-htmx-alpine`

## Technology stack

| Component                                           | Version          | Purpose                                          |
| --------------------------------------------------- | ---------------- | ------------------------------------------------ |
| [Rust](https://rust-lang.org/)                      | 1.96+ (ed. 2024) | Systems programming language                     |
| [axum](https://crates.io/crates/axum)               | 0.8              | Web application framework                        |
| [Loco](https://loco.rs/)                            | 0.16             | Rails-like framework on axum                     |
| [Tera](https://keats.github.io/tera/)               | 1.20             | Template engine                                  |
| [SeaORM](https://www.sea-ql.org/SeaORM/)            | 1.1              | Object relational mapper                         |
| [PostgreSQL](https://www.postgresql.org/)           | 18.3             | Database server                                  |
| [serde](https://serde.rs/)                          | 1.x              | Serialization with `rename_all = "camelCase"`    |
| [uuid](https://crates.io/crates/uuid)               | 1.6              | UUIDv4 primary keys                              |
| [tokio](https://tokio.rs/)                          | 1.45             | Async runtime (rt-multi-thread)                  |
| [chrono](https://crates.io/crates/chrono)           | 0.4              | Timestamps with serde support                    |
| [Assertables](https://crates.io/crates/assertables) | 9.8              | Assertion testing macros                         |
| [HTMX](https://htmx.org/)                           | 2.0.8            | AJAX navigation via `hx-boost`, live filtering   |
| [Alpine.js](https://alpinejs.dev/)                  | 3.14.8           | Client-side conditional fields and dynamic lists |
| [Criterion](https://crates.io/crates/criterion)     | 0.8.2            | Benchmarks                                       |
| [Tantivy](https://crates.io/crates/tantivy)         | 0.26.1           | Full-text search engine                          |
| [opentelemetry](https://crates.io/crates/opentelemetry)             | 0.27 | Vendor-neutral observability API           |
| [opentelemetry_sdk](https://crates.io/crates/opentelemetry_sdk)     | 0.27 | OpenTelemetry SDK (metrics + tracing)      |
| [opentelemetry-otlp](https://crates.io/crates/opentelemetry-otlp)   | 0.27 | OTLP gRPC/HTTP exporter to a collector     |
| [tracing-opentelemetry](https://crates.io/crates/tracing-opentelemetry) | 0.28 | Bridge `tracing` spans → OpenTelemetry  |
| [axum-prometheus](https://crates.io/crates/axum-prometheus)         | 0.7  | Prometheus `/metrics` endpoint for axum    |

## Loco

Create app:

```sh
loco new --name [form] --db postgres --bg pg --assets serverside
```

The `--bg pg` flag selects the **Postgres-backed background queue**. Loco's
SQLite-backed (`bg_sqlt`) and Redis-backed (`bg_redis`) queues are
**not** used in this monorepo — every backend runs on Postgres, so we keep
exactly one queue backend and drop the others (see [Background queue](#background-queue)).

Create cargo dependencies:

```sh
cargo add loco@0
cargo add axum@0
cargo add tera@1
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

Each form's full-stack crate is a Cargo workspace with a `migration` sub-crate:

```txt
full-stack-with-loco-tera-htmx-alpine/
  Cargo.toml                  # Workspace + package manifest
  .gitignore                  # ignore /target, /node_modules, etc.
  src/
    bin/
      main.rs                 # Single binary — runs both the HTTP server and the Loco management CLI
    app.rs                    # Loco App trait impl
    controllers/              # axum handlers per resource
    models/                   # SeaORM active-model wrappers + domain logic
    tasks/                    # Loco background tasks (optional)
    views/                    # Tera render helpers
    workers/                  # Loco workers (optional)
  templates/                  # Tera templates (.tera)
    base.html.tera            # Base layout — must include HTMX + Alpine script tags
  config/
    development.yaml          # Loco development config
    production.yaml           # Loco production config
  migration/                  # SeaORM migration crate
    src/
      lib.rs
      m*.rs                   # Migration files
```

## HTML script tags

The base Tera template `templates/base.html.tera` must include the HTMX and
Alpine.js CDN scripts exactly as shown (pinned versions, `defer` attribute):

HTMX:

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"
></script>
```

Alpine.js:

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"
></script>
```

The `<body>` tag must use `hx-boost="true"` for HTMX-driven navigation:

```html
<body hx-boost="true">
```

`bin/test-form` asserts all three of these strings are present.

## Backend pattern

- Loco framework with axum routing
- Rust scoring engine mirrors TypeScript types with `serde(rename_all = "camelCase")`
- SeaORM entities target PostgreSQL 18
- Tera templates render server-side; HTMX swaps fragments for navigation
- Alpine.js provides declarative conditional-field logic inside templates

## Form pattern

Every form is a **single-page wizard** (per the monorepo rule). The Rust
controller exposes three routes for the data-entry flow:

| Method | Route                     | Handler             | Purpose                                          |
| ------ | ------------------------- | ------------------- | ------------------------------------------------ |
| GET    | `/assessment/{id}`        | `show_assessment`   | Render `assessment.html.tera` with all sections  |
| POST   | `/assessment/{id}/submit` | `submit_assessment` | Merge every field into JSONB, redirect to report |
| GET    | `/assessment/{id}/report` | `show_report`       | Run grading engine, render `report.html.tera`    |

The top-level `templates/assessment.html.tera` extends `base.html.tera`,
opens one `<form method="POST" action="/assessment/{id}/submit">`, and
`{% include %}`s every `assessment/stepNN.html.tera` partial. Each partial
is plain markup (no `{% extends %}`, no form wrapper, no inter-step
navigation). There are no `_progress.html.tera` or `_nav.html.tera`
partials.

The view helper that builds the template context is
`build_assessment_context(data, id)`, which inserts `data`, the id, and
every top-level section field into the Tera context. There is no
per-step / progress-bar / prev-next context state.

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
all carry a `workers:` block in `BackgroundQueue` mode and a `queue:` block
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

`config/test.yaml`:

```yaml
workers:
  mode: BackgroundQueue

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

## Verify

```sh
for d in forms/*/full-stack-with-loco-tera-htmx-alpine; do
  (cd "$d" && cargo build && cargo test) || echo "FAIL: $d"
done
```
