# United Kingdom death registration — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the United Kingdom death registration form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`united_kingdom_death_registration/`](united_kingdom_death_registration/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  informants, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd united_kingdom_death_registration && cargo build && cargo test
```
