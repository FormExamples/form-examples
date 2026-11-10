# 4AT — Rapid Delirium and Cognitive-Impairment Screen — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the 4AT — Rapid Delirium and Cognitive-Impairment Screen form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`four_a_test_for_delirium/`](four_a_test_for_delirium/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd four_a_test_for_delirium && cargo build && cargo test
```
