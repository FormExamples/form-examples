# Abdominal Aortic Aneurysm (AAA) Screening — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Abdominal Aortic Aneurysm (AAA) Screening form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`abdominal_aortic_aneurysm_screening/`](abdominal_aortic_aneurysm_screening/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd abdominal_aortic_aneurysm_screening && cargo build && cargo test
```
