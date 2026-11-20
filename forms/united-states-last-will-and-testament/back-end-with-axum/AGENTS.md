# United States Last Will and Testament — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the United States Last Will and Testament form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`united_states_last_will_and_testament/`](united_states_last_will_and_testament/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): testators,
  attorneys, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd united_states_last_will_and_testament && cargo build && cargo test
```
