# back-end-with-loco — plan

Rust axum + Loco JSON API for the Neurodiversity Adjustment Review. The crate
uses a **relational** schema: one Loco migration and one SeaORM `_entity` per
SQL table (plus the Loco-default `users` table), the four-axis grading engine
under `src/engine/`, and JSON controllers under `src/controllers/`. Primary keys
are UUIDv4 (`gen_random_uuid()`); every domain table carries `created_at` /
`updated_at` / `deleted_at`.

## Layout

- `migration/` — per-table migrations (`workers`, `managers`,
  `neurodiversity_adjustment_reviews`, `..._grades`, `..._grade_rules`,
  `..._grade_flags`).
- `src/models/_entities/` — one SeaORM entity per table; `src/models/` — domain
  helpers (`from_payload`, `to_payload`, `persist_grade`, query helpers).
- `src/engine/` — pure four-axis engine: `effectiveness_rules`,
  `wellbeing_rules`, `completeness_rules`, `next_step_rules`, `flagged_issues`,
  `grader`, `types`, `utils`.
- `src/controllers/` — CRUD + `submit` / `result` endpoints and the dashboard
  join.

## Status

- [x] Crate builds cleanly (`cargo build`, `#![deny(missing_docs)]`).
- [x] Four-axis engine ported with canonical rule / flag IDs.
- [x] Engine tests pass (`cargo test`).
