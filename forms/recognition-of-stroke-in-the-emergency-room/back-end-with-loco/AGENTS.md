# Recognition Of Stroke In the Emergency Room (ROSIER) — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Recognition Of Stroke In the Emergency Room (ROSIER) form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`recognition_of_stroke_in_the_emergency_room/`](recognition_of_stroke_in_the_emergency_room/) — the Loco crate (migrations, `src/models/`,
  `src/controllers/`, `config/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd recognition_of_stroke_in_the_emergency_room && cargo build && cargo test
```
