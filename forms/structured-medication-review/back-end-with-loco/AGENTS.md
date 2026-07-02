# Structured Medication Review (SMR) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Structured Medication Review (SMR) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`structured_medication_review/`](structured_medication_review/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd structured_medication_review && cargo build && cargo test
```
