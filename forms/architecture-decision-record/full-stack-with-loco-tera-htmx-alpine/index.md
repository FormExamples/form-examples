# Full-stack (Rust + Loco + Tera + HTMX + Alpine.js)

Server-rendered ADR wizard backed by PostgreSQL via SeaORM, using:

- Rust edition 2024
- Loco 0.16, axum 0.8
- SeaORM 1.1
- Tera templates
- HTMX 2.0.8 for progressive enhancement
- Alpine.js 3.14.8 for sprinkles of client state

## Status

Pending implementation. The schema, XML, and FHIR representations are
ready. Generating the Loco scaffold is straightforward but produces a
large amount of boilerplate, deferred until needed.

## Bootstrap

```sh
./full-stack-with-loco-tera-htmx-alpine-setup
```

The setup script (one directory up) creates the Postgres user/databases
and runs `cargo loco generate scaffold` for each table in
`sql-migrations/`.
