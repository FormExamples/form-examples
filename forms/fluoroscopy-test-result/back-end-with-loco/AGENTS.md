# Fluoroscopy Test Result — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Fluoroscopy Test Result form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`fluoroscopy_test_result/`](fluoroscopy_test_result/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd fluoroscopy_test_result && cargo build && cargo test
```
