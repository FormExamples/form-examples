# Health Screening Questionnaire — Rust back-end (axum + Loco)

JSON API for the Health Screening Questionnaire form. No server-rendered
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

Crate source lives under `src/health_screening_questionnaire/` per the
monorepo route layout. One migration and one entity per SQL table —
relational, never a single JSONB blob.

| Entity | Route prefix |
| --- | --- |
| `patient` | `/api/patients/` |
| `assessor` | `/api/assessors/` |
| `health_screening_questionnaire` | `/api/health_screening_questionnaires/` |
| `health_screening_questionnaire_grade` | `/api/health_screening_questionnaire_grades/` |
| `health_screening_questionnaire_grade_flag` | `/api/health_screening_questionnaire_grade_flags/` |

Each exposes the standard scaffold set: `GET /` (list), `POST /` (create),
`GET /{id}`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`.

The SvelteKit dashboard reads `GET /api/health_screening_questionnaires`, and
the HTML dashboard reads the same endpoint from `http://localhost:5150`,
falling back to its bundled sample rows when the server is not running.

## Schema source of truth

[`../sql/`](../sql) is the source of truth. The `migration/` files are derived
from it and are kept in step by the fleet tools:

```sh
bin/loco-migration-defaults --check health-screening-questionnaire      # column defaults
bin/loco-migration-nullability --check health-screening-questionnaire   # column nullability
bin/loco-config-refactor --check health-screening-questionnaire         # queue + observability
bin/generate-loco-deny-config.py --check health-screening-questionnaire # supply-chain policy
```

Re-run each without `--check` after any schema change, and never hand-edit a
migration to disagree with `sql/`.

## Develop

The scaffold generator and the test suite both need a live PostgreSQL:

```sh
createdb health_screening_questionnaire_development
createdb health_screening_questionnaire_test
cargo loco db migrate
cargo loco start
```

`config/development.yaml` and `config/test.yaml` read `DATABASE_URL`, falling
back to `postgres://loco:loco@localhost:5433/...`.

## Verify

```sh
cargo build
cargo test                       # relational model + request tests
cargo deny --all-features check  # supply-chain policy
```

## Conventions

See the form root [`../AGENTS.md`](../AGENTS.md) and
[`/AGENTS/back-end-with-loco.md`](../../../AGENTS/back-end-with-loco.md).
