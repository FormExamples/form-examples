# United Kingdom Council Tax Discount Application — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the United Kingdom Council Tax Discount Application form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- `src/united_kingdom_council_tax_discount_application/` — the Axum crate source (`models/`, `controllers/`, `fixtures/`, `support/`); `migrations/` and `tests/` sit at the crate root.
- Relational per-table schema mirroring [`../sql/`](../sql/): `billing_authorities`,
  `applicants`, the application header, the `occupants` roster, and the grade /
  grade_rule / grade_flag trio. Routes are `/api/<plural>/`.

## Verify

```sh
cargo build && cargo test   # needs PostgreSQL; set DB_URL
```
