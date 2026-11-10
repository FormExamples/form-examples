# Modified Early Warning Score (MEWS) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Modified Early Warning Score (MEWS) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`modified_early_warning_score/`](modified_early_warning_score/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd modified_early_warning_score && cargo build && cargo test
```
