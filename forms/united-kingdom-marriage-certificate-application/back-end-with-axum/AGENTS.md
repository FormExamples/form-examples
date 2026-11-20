# United Kingdom Marriage Certificate Application — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the United Kingdom Marriage Certificate Application form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`united_kingdom_marriage_certificate_application/`](united_kingdom_marriage_certificate_application/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): applicants,
  registrars, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd united_kingdom_marriage_certificate_application && cargo build && cargo test
```
