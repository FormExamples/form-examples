# Child-Pugh Score (Child-Turcotte-Pugh) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Child-Pugh Score (Child-Turcotte-Pugh) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`child_pugh_score/`](child_pugh_score/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd child_pugh_score && cargo build && cargo test
```
