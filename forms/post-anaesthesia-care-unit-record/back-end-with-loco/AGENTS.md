# Post-Anaesthesia Care Unit (PACU) Record — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Post-Anaesthesia Care Unit (PACU) Record form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`post_anaesthesia_care_unit_record/`](post_anaesthesia_care_unit_record/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd post_anaesthesia_care_unit_record && cargo build && cargo test
```
