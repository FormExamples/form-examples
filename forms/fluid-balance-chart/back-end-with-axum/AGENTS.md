# Fluid Balance Chart — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Fluid Balance Chart form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`fluid_balance_chart/`](fluid_balance_chart/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd fluid_balance_chart && cargo build && cargo test
```
