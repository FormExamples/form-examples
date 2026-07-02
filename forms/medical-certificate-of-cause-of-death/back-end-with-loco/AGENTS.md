# Medical Certificate of Cause of Death (MCCD) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Medical Certificate of Cause of Death (MCCD) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`medical_certificate_of_cause_of_death/`](medical_certificate_of_cause_of_death/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd medical_certificate_of_cause_of_death && cargo build && cargo test
```
