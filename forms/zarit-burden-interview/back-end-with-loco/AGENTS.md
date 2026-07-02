# Zarit Burden Interview (ZBI) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Zarit Burden Interview (ZBI) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`zarit_burden_interview/`](zarit_burden_interview/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd zarit_burden_interview && cargo build && cargo test
```
