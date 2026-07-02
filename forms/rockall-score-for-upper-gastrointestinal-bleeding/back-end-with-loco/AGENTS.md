# Rockall Score for Upper Gastrointestinal Bleeding — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Rockall Score for Upper Gastrointestinal Bleeding form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`rockall_score_for_upper_gastrointestinal_bleeding/`](rockall_score_for_upper_gastrointestinal_bleeding/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd rockall_score_for_upper_gastrointestinal_bleeding && cargo build && cargo test
```
