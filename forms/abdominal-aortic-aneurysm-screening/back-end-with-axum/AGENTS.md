# Abdominal Aortic Aneurysm (AAA) Screening — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Abdominal Aortic Aneurysm (AAA) Screening form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`abdominal_aortic_aneurysm_screening/`](abdominal_aortic_aneurysm_screening/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd abdominal_aortic_aneurysm_screening && cargo build && cargo test
```
