# Pre-Anaesthesia Assessment — Rust full-stack

Server-rendered clinician wizard. Axum 0.16 framework on axum 0.8; sqlx
1.1 with PostgreSQL; Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8.

## Stack

- Rust edition 2024
- `axa` 0.16 (axum 0.8)
- `sqlx`
- PostgreSQL (schema in `../sql/`)
- `tera` templates with HTMX + Alpine.js (served from CDN)
- `serde` with `rename_all = "camelCase"` for TypeScript interop

## Running

```sh
cargo run
```

Server binds to `0.0.0.0:5150` by default.

## Endpoints

- `GET /` — landing + begin assessment
- `GET /assessment/{id}/step/{n}` — step form (HTMX fragment)
- `POST /assessment/{id}/step/{n}` — persist step
- `GET /assessment/{id}/report` — HTML report
- `GET /api/assessments` — JSON list for dashboard
- `GET /api/assessments/{id}` — JSON detail
