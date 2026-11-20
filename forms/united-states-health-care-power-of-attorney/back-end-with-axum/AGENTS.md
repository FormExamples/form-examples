# United States Health Care Power of Attorney — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the United States Health Care Power of Attorney form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`united_states_health_care_power_of_attorney/`](united_states_health_care_power_of_attorney/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): principals,
  reviewers, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd united_states_health_care_power_of_attorney && cargo build && cargo test
```
