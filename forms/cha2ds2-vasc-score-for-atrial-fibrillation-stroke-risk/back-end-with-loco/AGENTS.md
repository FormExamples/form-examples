# CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`cha2ds2_vasc_score_for_atrial_fibrillation_stroke_risk/`](cha2ds2_vasc_score_for_atrial_fibrillation_stroke_risk/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd cha2ds2_vasc_score_for_atrial_fibrillation_stroke_risk && cargo build && cargo test
```
