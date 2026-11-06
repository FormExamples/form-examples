# Bowel Cancer Screening with Faecal Immunochemical Test (FIT) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Bowel Cancer Screening with Faecal Immunochemical Test (FIT) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`bowel_cancer_screening_with_faecal_immunochemical_test/`](bowel_cancer_screening_with_faecal_immunochemical_test/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd bowel_cancer_screening_with_faecal_immunochemical_test && cargo build && cargo test
```
