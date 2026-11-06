# Centor Score for Streptococcal Pharyngitis — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Centor Score for Streptococcal Pharyngitis form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`centor_score_for_streptococcal_pharyngitis/`](centor_score_for_streptococcal_pharyngitis/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd centor_score_for_streptococcal_pharyngitis && cargo build && cargo test
```
