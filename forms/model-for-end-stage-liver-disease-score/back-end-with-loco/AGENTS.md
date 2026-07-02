# Model for End-Stage Liver Disease (MELD) Score — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Model for End-Stage Liver Disease (MELD) Score form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`model_for_end_stage_liver_disease_score/`](model_for_end_stage_liver_disease_score/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd model_for_end_stage_liver_disease_score && cargo build && cargo test
```
