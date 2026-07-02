# Columbia Suicide Severity Rating Scale (C-SSRS) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Columbia Suicide Severity Rating Scale (C-SSRS) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`columbia_suicide_severity_rating_scale/`](columbia_suicide_severity_rating_scale/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd columbia_suicide_severity_rating_scale && cargo build && cargo test
```
