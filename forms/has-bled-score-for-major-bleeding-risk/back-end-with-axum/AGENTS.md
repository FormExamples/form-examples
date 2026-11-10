# HAS-BLED Score for Major Bleeding Risk — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the HAS-BLED Score for Major Bleeding Risk form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`has_bled_score_for_major_bleeding_risk/`](has_bled_score_for_major_bleeding_risk/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd has_bled_score_for_major_bleeding_risk && cargo build && cargo test
```
