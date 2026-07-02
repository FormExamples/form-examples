# Padua Venous Thromboembolism Risk Assessment (Padua Prediction Score) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Padua Venous Thromboembolism Risk Assessment (Padua Prediction Score) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`padua_venous_thromboembolism_risk_assessment/`](padua_venous_thromboembolism_risk_assessment/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd padua_venous_thromboembolism_risk_assessment && cargo build && cargo test
```
