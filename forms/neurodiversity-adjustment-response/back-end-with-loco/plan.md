# back-end-with-loco — plan

Rust axum + Loco JSON API for the Neurodiversity Adjustment Response. The crate
uses a **relational** schema: one Loco migration and one SeaORM `_entity` per
SQL table (plus the Loco-default `users` table), the four-axis grading engine
under `src/engine/`, and JSON controllers under `src/controllers/`. Primary keys
are UUIDv4 (`gen_random_uuid()`); every domain table carries `created_at` /
`updated_at` / `deleted_at`.

- [x] Loco crate materialized (`Cargo.toml`, `src/`, `migration/`, `config/`)
- [x] Relational migrations: `users`, `workers`, `managers`,
      `neurodiversity_adjustment_responses`,
      `neurodiversity_adjustment_response_grades` (1:1 unique FK),
      `neurodiversity_adjustment_response_grade_rules`,
      `neurodiversity_adjustment_response_grade_flags`
- [x] SeaORM entities + domain models, one per table, with FK relations
- [x] Four-axis grading engine (`src/engine/`) — `R-OUTCOME-*` / `R-LEGAL-*` /
      `R-COMPLETE-*` / `R-FOLLOWUP-*` rules and `F-*` flags identical to the
      HTML / Svelte stacks; declined-with-no-rationale → high legal risk +
      `F-DISCRIMINATION-RISK-001`, escalation → escalation-needed follow-up
- [x] JSON API: CRUD on `/api/neurodiversity_adjustment_responses`, `submit`
      (transactional persist of grade + rules + flags, idempotent), `result`,
      `/api/dashboard` (grade joined to response)
- [x] Engine + flag tests (`tests/engine/`); `cargo build` and `cargo test`
      green
- [ ] JSON API integration tests against a live Postgres test database
