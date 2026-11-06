# Wells Score for Pulmonary Embolism — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Wells Score for Pulmonary Embolism form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`wells_score_for_pulmonary_embolism/`](wells_score_for_pulmonary_embolism/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd wells_score_for_pulmonary_embolism && cargo build && cargo test
```
