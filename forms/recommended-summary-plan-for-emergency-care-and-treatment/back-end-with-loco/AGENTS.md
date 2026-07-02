# Recommended Summary Plan for Emergency Care and Treatment (ReSPECT) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Recommended Summary Plan for Emergency Care and Treatment (ReSPECT) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`recommended_summary_plan_for_emergency_care_and_treatment/`](recommended_summary_plan_for_emergency_care_and_treatment/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd recommended_summary_plan_for_emergency_care_and_treatment && cargo build && cargo test
```
