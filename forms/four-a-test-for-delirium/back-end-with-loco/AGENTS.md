# 4AT — Rapid Delirium and Cognitive-Impairment Screen — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the 4AT — Rapid Delirium and Cognitive-Impairment Screen form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`four_a_test_for_delirium/`](four_a_test_for_delirium/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd four_a_test_for_delirium && cargo build && cargo test
```
