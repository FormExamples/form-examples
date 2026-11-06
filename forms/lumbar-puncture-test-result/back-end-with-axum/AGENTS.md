# Lumbar Puncture Test Result — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Lumbar Puncture Test Result form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`lumbar_puncture_test_result/`](lumbar_puncture_test_result/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd lumbar_puncture_test_result && cargo build && cargo test
```
