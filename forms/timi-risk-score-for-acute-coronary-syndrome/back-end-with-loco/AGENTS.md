# TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`timi_risk_score_for_acute_coronary_syndrome/`](timi_risk_score_for_acute_coronary_syndrome/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd timi_risk_score_for_acute_coronary_syndrome && cargo build && cargo test
```
