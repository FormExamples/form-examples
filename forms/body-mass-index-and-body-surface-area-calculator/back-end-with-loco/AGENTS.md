# Body Mass Index and Body Surface Area Calculator — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Body Mass Index and Body Surface Area Calculator form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`body_mass_index_and_body_surface_area_calculator/`](body_mass_index_and_body_surface_area_calculator/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd body_mass_index_and_body_surface_area_calculator && cargo build && cargo test
```
