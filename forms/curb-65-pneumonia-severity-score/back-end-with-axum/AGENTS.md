# CURB-65 Pneumonia Severity Score — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the CURB-65 Pneumonia Severity Score form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`curb_65_pneumonia_severity_score/`](curb_65_pneumonia_severity_score/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd curb_65_pneumonia_severity_score && cargo build && cargo test
```
