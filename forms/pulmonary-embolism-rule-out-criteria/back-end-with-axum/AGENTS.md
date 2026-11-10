# Pulmonary Embolism Rule-out Criteria (PERC) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Pulmonary Embolism Rule-out Criteria (PERC) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`pulmonary_embolism_rule_out_criteria/`](pulmonary_embolism_rule_out_criteria/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd pulmonary_embolism_rule_out_criteria && cargo build && cargo test
```
