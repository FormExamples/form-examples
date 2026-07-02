# Ottawa Ankle Rules (and Ottawa Foot Rules) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Ottawa Ankle Rules (and Ottawa Foot Rules) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`ottawa_ankle_rules/`](ottawa_ankle_rules/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd ottawa_ankle_rules && cargo build && cargo test
```
