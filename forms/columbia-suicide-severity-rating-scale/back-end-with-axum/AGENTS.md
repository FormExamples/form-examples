# Columbia Suicide Severity Rating Scale (C-SSRS) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Columbia Suicide Severity Rating Scale (C-SSRS) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`columbia_suicide_severity_rating_scale/`](columbia_suicide_severity_rating_scale/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd columbia_suicide_severity_rating_scale && cargo build && cargo test
```
