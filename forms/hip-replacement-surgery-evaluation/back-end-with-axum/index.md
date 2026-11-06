# Hip Replacement Surgery Evaluation — Rust back-end (axum + axa + sqlx)

JSON API for the Hip Replacement Surgery Evaluation form. No server-rendered
templates, no Tera, no HTMX, no CSS — the two front-ends
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

Crate source lives under `src/hip_replacement_surgery_evaluation/` per the
monorepo route layout. One migration and one entity per SQL table —
relational, never a single JSONB blob.

| Entity | Route prefix |
| --- | --- |
| `patient` | `/api/patients/` |
| `clinician` | `/api/clinicians/` |
| `hip_replacement_surgery_evaluation` | `/api/hip_replacement_surgery_evaluations/` |
| `hip_replacement_surgery_evaluation_grade` | `/api/hip_replacement_surgery_evaluation_grades/` |
| `hip_replacement_surgery_evaluation_grade_flag` | `/api/hip_replacement_surgery_evaluation_grade_flags/` |

Each exposes the standard scaffold set: `GET /` (list), `POST /` (create),
`GET /{id}`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`.

## Schema source of truth

[`../sql/`](../sql) is the source of truth. The `migrations/` files are derived
from it and are kept in step by the fleet tools:

```sh
bin/loco-migration-defaults --check hip-replacement-surgery-evaluation      # column defaults
bin/loco-migration-nullability --check hip-replacement-surgery-evaluation   # column nullability
bin/loco-config-refactor --check hip-replacement-surgery-evaluation         # queue + observability
bin/generate-axum-deny-config.py --check hip-replacement-surgery-evaluation # supply-chain policy
```

Re-run each without `--check` after any schema change, and never hand-edit a
migration to disagree with `sql/`.

## Develop

The scaffold generator and the test suite both need a live PostgreSQL:

```sh
createdb hip_replacement_surgery_evaluation_development
createdb hip_replacement_surgery_evaluation_test
cargo run -- db migrate
cargo run -- start
```

`DATABASE_URL` selects the database, with a local default per environment...`.

## Verify

```sh
cargo build
cargo test                       # 28 tests
cargo deny --all-features check  # supply-chain policy
```

Note: `cargo deny` currently reports RUSTSEC-2023-0071 (`rsa`, reached
transitively through sqlx's MySQL driver). This is a fleet-wide condition —
the canonical reference crate `forms/medical-operation-note/back-end-with-axum`
fails identically — not something specific to this form.

## Conventions

See the form root [`../AGENTS.md`](../AGENTS.md) and
[`/AGENTS/back-end-with-axum.md`](../../../AGENTS/back-end-with-axum.md).
