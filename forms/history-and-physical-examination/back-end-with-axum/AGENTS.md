# History and Physical Examination (H&P) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the History and Physical Examination (H&P) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`history_and_physical_examination/`](history_and_physical_examination/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd history_and_physical_examination && cargo build && cargo test
```
