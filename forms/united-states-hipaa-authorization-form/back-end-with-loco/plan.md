# Plan: back-end-with-loco

Rust full-stack implementation using Loco + axum + Loco JSON API + Alpine.

## Build order

1. [x] Scaffold via the parent `../back-end-with-loco-setup`
       shell script (one `cargo loco generate scaffold` call per SQL
       table).
2. [x] `Cargo.toml`, `.gitignore`, baseline `src/lib.rs`, `src/app.rs`,
       `src/bin/main.rs`.
3. [x] `templates/base.html.tera` with HTMX 2.0.8 and Alpine.js 3.14.8
       script tags.
4. [x] SeaORM models in `src/models/` (one per SQL table).
5. [x] Controllers in `src/controllers/`.
6. [x] Validation engine port in `src/engine/`.
7. [ ] PDF rendering via `printpdf` or `wkhtmltopdf` wrapper.
8. [ ] HTMX-driven step navigation.
9. [ ] Authentication + per-user role-based access.
10. [ ] Audit log of revocations.
