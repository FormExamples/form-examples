# Cardiac Stress Test Result — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Cardiac Stress Test Result form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`cardiac_stress_test_result/`](cardiac_stress_test_result/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd cardiac_stress_test_result && cargo build && cargo test
```
