# Perioperative Optimization — Rust back-end (axum + axa + sqlx)

JSON API for the Perioperative Optimization form. No server-rendered templates,
no Tera, no HTMX, no CSS — the two front-ends
([`../front-end-with-html/`](../front-end-with-html),
[`../front-end-with-svelte/`](../front-end-with-svelte)) own the UI.

## Stack

- Rust edition 2021, Axum 1.0.1 on axum 0.8
- sqlx with PostgreSQL
- Background queue: Postgres (`BackgroundQueue` in development,
  `ForegroundBlocking` in test)
- Observability: OpenTelemetry traces + a Prometheus `/metrics` endpoint
- `serde(rename_all = "camelCase")` on structs shared with the front-ends

## Layout

Crate source lives under `src/perioperative_optimization/` per the monorepo
route layout. One migration and one entity per SQL table — relational, never a
single JSONB blob.

| Entity | Route prefix |
| --- | --- |
| `patient` | `/api/patients/` |
| `clinician` | `/api/clinicians/` |
| `medication` | `/api/medications/` |
| `patient_medication` | `/api/patient_medications/` |
| `allergy` | `/api/allergies/` |
| `patient_allergy` | `/api/patient_allergies/` |
| `perioperative_optimization` | `/api/perioperative_optimizations/` |
| `perioperative_optimization_grade` | `/api/perioperative_optimization_grades/` |
| `perioperative_optimization_grade_domain` | `/api/perioperative_optimization_grade_domains/` |
| `perioperative_optimization_grade_flag` | `/api/perioperative_optimization_grade_flags/` |

Each exposes the standard scaffold set: `GET /` (list), `POST /` (create),
`GET /{id}`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`.

Note the `_grade_domain` collection: unlike the sibling pre-operative forms,
the per-domain optimization statuses are this form's primary output rather than
an audit trail beneath a single score, so they are a first-class resource. A
waiting-list dashboard can query it directly for "every assessment with an
anaemia domain short on time".

Both dashboards read `GET /api/perioperative_optimizations`, falling back to
bundled sample rows when the server is not running.

## Schema source of truth

[`../sql/`](../sql) is the source of truth. The `migrations/` files are derived
from it and are kept in step by the fleet tools:

```sh
bin/loco-migration-defaults --check perioperative-optimization
bin/loco-migration-nullability --check perioperative-optimization
bin/loco-config-refactor --check perioperative-optimization
bin/generate-axum-deny-config.py --check perioperative-optimization
```

Re-run each without `--check` after any schema change, and never hand-edit a
migration to disagree with `sql/`.

## Develop

The scaffold generator and the test suite both need a live PostgreSQL:

```sh
createdb perioperative_optimization_development
createdb perioperative_optimization_test
cargo run -- db migrate
cargo run -- start
```

`DB_URL` selects the database, with a local default per environment...`.

## Verify

```sh
cargo build
cargo test                       # 33 tests
cargo deny --all-features check  # supply-chain policy
```

Note: `cargo deny` reports RUSTSEC-2023-0071 (`rsa`, reached transitively
through sqlx's MySQL driver). This is a fleet-wide condition — the canonical
reference crate `forms/medical-operation-note/back-end-with-axum` fails
identically — not something specific to this form.

## Conventions

See the form root [`../AGENTS.md`](../AGENTS.md) and
[`/AGENTS/back-end-with-axum.md`](../../../AGENTS/back-end-with-axum.md).
