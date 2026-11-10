# Child Safeguarding Referral — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Child Safeguarding Referral form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`child_safeguarding_referral/`](child_safeguarding_referral/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd child_safeguarding_referral && cargo build && cargo test
```
