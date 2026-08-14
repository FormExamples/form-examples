# back-end-with-loco — tasks

- [x] Materialize the Loco crate (`Cargo.toml`, `src/`, `migration/`, `config/`)
- [x] Relational per-table migrations: `users` (Loco default), `workers`,
      `managers`, `neurodiversity_adjustment_responses` (FKs to worker +
      manager), `neurodiversity_adjustment_response_grades` (1:1 unique FK to
      response), `neurodiversity_adjustment_response_grade_rules`,
      `neurodiversity_adjustment_response_grade_flags`
- [x] SeaORM `_entities/*` and domain `models/*` per table, with FK relations
      and auto-`updated_at` `before_save` behaviour
- [x] Four-axis grading engine (`outcome_rules`, `legal_risk_rules`,
      `completeness_rules`, `follow_up_rules`, `grader`, `flagged_issues`,
      `utils`, `types`) with rule / flag IDs identical to the HTML / Svelte
      stacks and the canonical engine spec
- [x] JSON API controllers: CRUD on `/api/neurodiversity_adjustment_responses`,
      transactional `submit` persisting grade + rule rows + flag rows
      (idempotent), `result` read-back, `/api/dashboard` (grade joined to
      response)
- [x] Engine + flag unit tests (`tests/engine/`); `cargo test --test
      engine_tests` green (13 passing)
- [x] `cargo build` clean (0 warnings)
- [ ] JSON API integration tests; full DB-backed `cargo test` (requires local Postgres)
