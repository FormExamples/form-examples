# Edinburgh Postnatal Depression Scale (EPDS) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Edinburgh Postnatal Depression Scale (EPDS) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`edinburgh_postnatal_depression_scale/`](edinburgh_postnatal_depression_scale/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd edinburgh_postnatal_depression_scale && cargo build && cargo test
```
