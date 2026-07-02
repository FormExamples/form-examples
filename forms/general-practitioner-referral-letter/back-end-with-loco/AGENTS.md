# General Practitioner Referral Letter — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the General Practitioner Referral Letter form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`general_practitioner_referral_letter/`](general_practitioner_referral_letter/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd general_practitioner_referral_letter && cargo build && cargo test
```
