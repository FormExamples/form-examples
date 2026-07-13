# Back end

Each form has one Rust JSON-API crate in `back-end-with-loco/`: axum 0.8 +
[Loco](https://loco.rs) 0.16 + SeaORM 1.1 over PostgreSQL, Rust edition 2021. It
is a pure JSON API — no Tera, HTMX, Alpine, or CSS. The reference crate is
`forms/medical-operation-note/back-end-with-loco`.

Authoring rules: [`AGENTS/back-end-with-loco.md`](../AGENTS/back-end-with-loco.md).

## Layout

Crate source lives under `src/<form_snake_case>/` (e.g.
`src/medical_operation_note/`):

```
src/<snake>/
  app.rs               Loco Hooks: routes, workers, initializers
  bin/main.rs          CLI entrypoint
  controllers/         axum handlers (one per entity) + auth
  models/              SeaORM ActiveModels; _entities/ holds generated entities
  engine/              the pure scoring engine (types, *_rules, grader, flagged_issues)
  views/  workers/  tasks/  initializers/  mailers/  fixtures/
migration/src/         one mNN_<timestamp>_<table>.rs per SQL table
config/                development.yaml, test.yaml, production.yaml
tests/                 models/ requests/ engine/ tasks/ workers/ (+ snapshots)
Cargo.toml  Cargo.lock
```

## Relational per-table mapping

The mapping from `sql/` is **one migration and one model entity per SQL table** —
this is the correct/gold shape; a single JSONB blob table is wrong. For
`medical-operation-note` the migrations and models line up table-for-table with
the SQL: `patients`, `clinicians`, `medical_operation_notes`, its child tables
(`…_procedures`, `…_steps`, `…_implants`, `…_drains`, `…_specimens`,
`…_complications`, `…_team_members`), and the grading trio
(`…_grades`, `…_grade_rules`, `…_grade_flags`). Each table keeps the same spine
as the SQL: a UUIDv4 primary key via `gen_random_uuid()`, and
`created_at` / `updated_at` / `deleted_at` timestamps.

Request/response structs that cross the wire to the front-end carry
`serde(rename_all = "camelCase")`, so the JSON API speaks camelCase while Rust
internals stay snake_case — the same boundary described in
[Data model](data-model.md).

The scoring `engine/` module is plain, DB-free Rust: controllers deserialise a
request, call the engine, and persist the grade + rules + flags. It shares rule
and flag IDs with the JS and TypeScript engines — see
[Scoring engines](scoring-engines.md).

## Configuration

Three environments, each a Loco YAML in `config/`. The database and queue point
at Postgres via the `DATABASE_URL` env var with a per-form default, e.g.:

```yaml
database:
  uri: {{ get_env(name="DATABASE_URL",
         default="postgres://loco:loco@localhost:5432/medical_operation_note_development") }}
  auto_migrate: true
```

`_development`, `_test`, and `_production` databases follow the
`<form_snake_case>_<env>` naming.

## Background queue + observability convention

The canonical convention (enforced by `bin/loco-config-refactor --check`) is:

- **Postgres-only background queue.** `loco-rs` is declared with
  `default-features = false` and an explicit feature list
  (`auth_jwt`, `bg_pg`, `cache_inmem`, `cli`, `with-db`); the SQLite (`bg_sqlt`)
  and Redis (`bg_redis`) queues are removed. In the config, `workers.mode` is
  `BackgroundQueue` (development/production) or `ForegroundBlocking` (test, so
  queued mailer jobs run inline), and the `queue:` block is `kind: Postgres`
  reusing the same URI as `database.uri`.
- **OpenTelemetry + Prometheus observability.** Cargo.toml carries the OTLP
  exporter deps (`opentelemetry`, `opentelemetry_sdk`, `opentelemetry-otlp`,
  `tracing-opentelemetry`) and the Prometheus `/metrics` dependency
  (`axum-prometheus`).

`bin/loco-config-refactor` applies this mechanically and is idempotent; its
`--check --all` mode is the CI drift detector (see [Verification](verification.md)).

## Tests boot a real database

Model and request tests use `loco_rs::testing::prelude::*`: `boot_test::<App>()`
brings up the app against the `_test` Postgres database, `seed::<App>()` loads
fixtures, and assertions use `insta` snapshots (`serial_test`'s `#[serial]`
serialises DB access). In CI the Rust job runs `cargo check` + `cargo clippy -D
warnings` + `cargo test` across an 8-way shard matrix, each shard with its own
Postgres-backed per-crate database.

## The setup generator

`back-end-with-loco-setup` is a **generated** executable shell script (never
hand-edited) produced by
`bin/back-end-with-loco/generate-back-end-with-loco-setup.py`. It captures how
the crate is scaffolded from scratch: `createdb` for the three environments,
`loco new`, and a `cargo loco generate scaffold --api` call per table with its
columns and types. Regenerating it is drift-checked like every other generated
artefact — see [Generator pipeline](generator-pipeline.md).

Local Postgres setup for the DB-backed gates is in
[`CONTRIBUTING.md`](../CONTRIBUTING.md); the reference crate is
`forms/medical-operation-note/back-end-with-loco`.
