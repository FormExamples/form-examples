# Emergency Department Triage Note — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Emergency Department Triage Note form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`emergency_department_triage_note/`](emergency_department_triage_note/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd emergency_department_triage_note && cargo build && cargo test
```
