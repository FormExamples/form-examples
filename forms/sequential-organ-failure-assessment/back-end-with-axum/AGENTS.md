# Sequential Organ Failure Assessment (SOFA) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Sequential Organ Failure Assessment (SOFA) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`sequential_organ_failure_assessment/`](sequential_organ_failure_assessment/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd sequential_organ_failure_assessment && cargo build && cargo test
```
