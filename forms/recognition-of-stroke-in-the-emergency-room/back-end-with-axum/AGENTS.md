# Recognition Of Stroke In the Emergency Room (ROSIER) — Back-end with Rust Axum (JSON API)

Pure JSON API back-end for the Recognition Of Stroke In the Emergency Room (ROSIER) form, built with axum + axa + sqlx + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-axum.md

## Layout

- [`recognition_of_stroke_in_the_emergency_room/`](recognition_of_stroke_in_the_emergency_room/) — the Axum crate (migrations, `src/models/`,
  `src/controllers/`, `migrations/`, `tests/`).
- Relational per-table schema mirroring [`../sql/`](../sql/): patients,
  clinicians, the form header, child tables, and the grade /
  grade_rule / grade_flag trio.

## Verify

```sh
cd recognition_of_stroke_in_the_emergency_room && cargo build && cargo test
```
