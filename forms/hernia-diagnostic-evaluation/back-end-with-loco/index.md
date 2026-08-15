# Hernia Diagnostic Evaluation — Rust back-end (axum + Loco)

JSON API for the Hernia Diagnostic Evaluation form. No server-rendered
templates, no Tera, no HTMX, no CSS — the two front-ends
([`../front-end-with-html/`](../front-end-with-html),
[`../front-end-with-svelte/`](../front-end-with-svelte)) own the UI.

## Stack

- Rust edition 2021, Loco 1.0.1 on axum 0.8
- SeaORM with PostgreSQL
- Background queue: Postgres (`BackgroundQueue` in development,
  `ForegroundBlocking` in test)
- Observability: OpenTelemetry traces + a Prometheus `/metrics` endpoint
- `serde(rename_all = "camelCase")` on structs shared with the front-ends

## Layout

Crate source lives under `src/hernia_diagnostic_evaluation/` per the monorepo
route layout. One migration and one entity per SQL table — relational, never
a single JSONB blob.

| Entity | Route prefix |
| --- | --- |
| `patient` | `/api/patients/` |
| `clinician` | `/api/clinicians/` |
| `hernia_diagnostic_evaluation` | `/api/hernia_diagnostic_evaluations/` |
| `hernia_diagnostic_evaluation_grade` | `/api/hernia_diagnostic_evaluation_grades/` |
| `hernia_diagnostic_evaluation_grade_flag` | `/api/hernia_diagnostic_evaluation_grade_flags/` |

Each exposes the standard scaffold set: `GET /` (list), `POST /` (create),
`GET /{id}`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`.

The SvelteKit dashboard reads `GET /api/hernia_diagnostic_evaluations`, and
the HTML dashboard reads the same endpoint from `http://localhost:5150`,
falling back to its bundled sample rows when the server is not running.

## Schema source of truth

[`../sql/`](../sql) is the source of truth. The `migration/` files are derived
from it and are kept in step by the fleet tools:

```sh
bin/loco-migration-defaults --check hernia-diagnostic-evaluation      # column defaults
bin/loco-migration-nullability --check hernia-diagnostic-evaluation   # column nullability
bin/loco-config-refactor --check hernia-diagnostic-evaluation         # queue + observability
bin/generate-loco-deny-config.py --check hernia-diagnostic-evaluation # supply-chain policy
```

Re-run each without `--check` after any schema change, and never hand-edit a
migration to disagree with `sql/`.

## Develop

The scaffold generator and the test suite both need a live PostgreSQL:

```sh
createdb hernia_diagnostic_evaluation_development
createdb hernia_diagnostic_evaluation_test
cargo loco db migrate
cargo loco start
```

`config/development.yaml` and `config/test.yaml` read `DATABASE_URL`, falling
back to `postgres://loco:loco@localhost:5433/...`.

## Verify

```sh
cargo build
cargo test                       # 28 tests
cargo deny --all-features check  # supply-chain policy
```

Note: `cargo deny` may report RUSTSEC-2023-0071 (`rsa`, reached transitively
through SeaORM's MySQL driver). This is a fleet-wide condition — the
canonical reference crate `forms/medical-operation-note/back-end-with-loco`
fails identically — not something specific to this form.

## Conventions

See the form root [`../AGENTS.md`](../AGENTS.md) and
[`/AGENTS/back-end-with-loco.md`](../../../AGENTS/back-end-with-loco.md).
