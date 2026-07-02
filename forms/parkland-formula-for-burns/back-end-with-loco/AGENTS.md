# Parkland Formula for Burns — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Parkland Formula for Burns form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`parkland_formula_for_burns/`](parkland_formula_for_burns/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd parkland_formula_for_burns && cargo build && cargo test
```
