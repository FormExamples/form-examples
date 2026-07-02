# Quick Sequential Organ Failure Assessment (qSOFA) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Quick Sequential Organ Failure Assessment (qSOFA) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`quick_sequential_organ_failure_assessment/`](quick_sequential_organ_failure_assessment/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd quick_sequential_organ_failure_assessment && cargo build && cargo test
```
