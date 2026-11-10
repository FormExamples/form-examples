# Parkland Formula for Burns — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Parkland Formula for Burns form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`parkland_formula_for_burns/`](parkland_formula_for_burns/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd parkland_formula_for_burns && cargo build && cargo test
```
