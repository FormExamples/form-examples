# ICVP — Full Stack with Loco / Tera / HTMX / Alpine — agent instructions

Rust 2024 + Loco 0.16 (axum 0.8) + SeaORM 1.1 + Tera 1.20 + HTMX 2.0.8 +
Alpine.js 3.14.8. Single-page wizard with eight steps, validation engine
mirrored from the TypeScript engine, and a printable certificate report.

## Stack pinning

- HTMX `2.0.8` and Alpine.js `3.14.8` via the exact CDN URLs in
  `templates/base.html.tera`. `bin/test-form` greps for these strings.
- `<body hx-boost="true">` is required.
- `serde(rename_all = "camelCase")` on every struct exposed to the front end.
- snake_case Rust modules and SQL columns.

## Validation engine

A Rust port of the TypeScript engine in `front-end-form-with-svelte/src/lib/engine/`.
Same rule catalogue (VAL001..VAL012). Pure functions in
`src/models/validation.rs`. Unit-tested in `src/models/validation.rs#tests`.

## Database naming

Database names use the **full** form slug, never an abbreviation:

- `international_certificate_of_vaccination_or_prophylaxis_development`
- `international_certificate_of_vaccination_or_prophylaxis_test`
- `international_certificate_of_vaccination_or_prophylaxis_production`

## Scaffolding script

`../full-stack-with-loco-tera-htmx-alpine-setup` is a `#!/bin/sh` helper
that creates the Loco app and runs `cargo loco generate scaffold` once per
table, in dependency order. Re-run it after editing the SQL migrations.

## Acceptance

`bin/test-form international-certificate-of-vaccination-or-prophylaxis`
passes. That requires:

- `Cargo.toml`, `.gitignore`, `src/`, `target/` exist.
- `templates/base.html.tera` contains the HTMX and Alpine CDN tags and
  `<body hx-boost="true">`.
- `cargo build` and `cargo test` (best-effort; the harness tolerates
  failures here).
