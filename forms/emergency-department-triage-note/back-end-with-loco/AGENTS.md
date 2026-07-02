# Emergency Department Triage Note — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Emergency Department Triage Note form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`emergency_department_triage_note/`](emergency_department_triage_note/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd emergency_department_triage_note && cargo build && cargo test
```
