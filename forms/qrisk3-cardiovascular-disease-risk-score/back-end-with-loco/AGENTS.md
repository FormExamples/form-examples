# QRISK3 Cardiovascular Disease Risk Score — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the QRISK3 Cardiovascular Disease Risk Score form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`qrisk3_cardiovascular_disease_risk_score/`](qrisk3_cardiovascular_disease_risk_score/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd qrisk3_cardiovascular_disease_risk_score && cargo build && cargo test
```
