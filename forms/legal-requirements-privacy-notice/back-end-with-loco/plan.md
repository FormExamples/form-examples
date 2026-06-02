# Plan: Legal Requirements Privacy Notice: Full Stack With Rust Axum Loco Tera

## Current status

Pending implementation. Scaffold present (sql-migrations, generated setup
script). Rust crate not yet authored.

## Implementation plan

1. Run the generated `back-end-with-loco-setup` script to
   scaffold the Loco app and run `cargo loco generate scaffold` for each
   table in `sql-migrations/`.
2. Author engine types, rules, grader, and flagged-issues mirroring the
   front-end-form-with-svelte engine, with `serde(rename_all = "camelCase")`
   on shared structs.
3. Wire HTTP routes: `GET /` landing, `POST /assessment/new`,
   `GET /assessment/{id}` form, `POST /assessment/{id}/submit`,
   `GET /assessment/{id}/report`, `GET /dashboard`.
4. Author Tera templates including `templates/base.html.tera` with the
   pinned HTMX 2.0.8 and Alpine.js 3.14.8 `<script defer>` tags and
   `<body hx-boost="true">` (asserted by `bin/test-form`).
5. Add cargo tests covering the grader and flagged-issues end-to-end.

See [AGENTS.md](AGENTS.md) for the planned project structure.
