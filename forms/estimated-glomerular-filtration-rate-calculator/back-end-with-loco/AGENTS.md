# Estimated Glomerular Filtration Rate (eGFR) Calculator — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Estimated Glomerular Filtration Rate (eGFR) Calculator form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`estimated_glomerular_filtration_rate_calculator/`](estimated_glomerular_filtration_rate_calculator/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd estimated_glomerular_filtration_rate_calculator && cargo build && cargo test
```
