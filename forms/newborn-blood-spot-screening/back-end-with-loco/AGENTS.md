# Newborn Blood Spot Screening — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Newborn Blood Spot Screening form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`newborn_blood_spot_screening/`](newborn_blood_spot_screening/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd newborn_blood_spot_screening && cargo build && cargo test
```
