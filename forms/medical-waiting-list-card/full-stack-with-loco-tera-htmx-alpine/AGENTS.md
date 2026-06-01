# Medical Waiting List Card — full-stack Rust crate

Full-stack implementation: Rust edition 2024, Loco 0.16 on axum 0.8,
SeaORM 1.1 with PostgreSQL, Tera templates with HTMX 2.0.8 and
Alpine.js 3.14.8.

See [`../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md`](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
for the shared stack conventions, the form-level
[`../AGENTS.md`](../AGENTS.md) for the data model, and
[`./index.md`](./index.md) for the bootstrap commands.

## Conventions

- `serde(rename_all = "camelCase")` on every struct shared with the
  front-end.
- Tera base template includes HTMX 2.0.8 + Alpine.js 3.14.8 via CDN and
  uses `<body hx-boost="true">` for progressive enhancement (these are
  verified by `bin/test-form`).
- Pure scoring engine ported from the TypeScript engine in
  `front-end-form-with-svelte/src/lib/engine/`.
