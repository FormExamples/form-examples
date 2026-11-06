# Wells Score for Deep Vein Thrombosis (DVT) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Wells Score for Deep Vein Thrombosis (DVT) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`wells_score_for_deep_vein_thrombosis/`](wells_score_for_deep_vein_thrombosis/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd wells_score_for_deep_vein_thrombosis && cargo build && cargo test
```
