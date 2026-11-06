# Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`alcohol_use_disorders_identification_test_consumption/`](alcohol_use_disorders_identification_test_consumption/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd alcohol_use_disorders_identification_test_consumption && cargo build && cargo test
```
