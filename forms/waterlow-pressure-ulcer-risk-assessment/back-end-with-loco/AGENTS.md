# Waterlow Pressure Ulcer Risk Assessment — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Waterlow Pressure Ulcer Risk Assessment form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`waterlow_pressure_ulcer_risk_assessment/`](waterlow_pressure_ulcer_risk_assessment/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd waterlow_pressure_ulcer_risk_assessment && cargo build && cargo test
```
