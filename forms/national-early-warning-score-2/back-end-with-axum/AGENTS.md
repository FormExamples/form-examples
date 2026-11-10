# National Early Warning Score 2 (NEWS2) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the National Early Warning Score 2 (NEWS2) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`national_early_warning_score_2/`](national_early_warning_score_2/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd national_early_warning_score_2 && cargo build && cargo test
```
