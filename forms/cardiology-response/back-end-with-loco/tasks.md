# back-end-with-loco — tasks

- [x] Generate `back-end-with-loco-setup` scaffold script
- [x] Materialize the Loco crate (`Cargo.toml`, `src/`, `migration/`, `config/`)
- [x] Refactor from the single-table JSONB pattern to the relational
      `medical-operation-note` template: per-table migrations + entities
- [x] Migrations: `users` (Loco default), `patients`, `clinicians`,
      `cardiology_responses` (FKs to patient + clinician),
      `cardiology_response_grades` (1:1 unique FK to response),
      `cardiology_response_grade_rules`, `cardiology_response_grade_flags`
- [x] SeaORM `_entities/*` and domain `models/*` per table, with FK relations
      and auto-`updated_at` `before_save` behaviour
- [x] Port the four-axis interpretation engine (classification, severity,
      completeness, follow-up, grader, flagged-issues, utils, types) with
      identical rule and flag IDs — preserved unchanged through the refactor
- [x] JSON API controllers: CRUD on `/api/cardiology_responses`, transactional
      `submit` persisting grade + rule rows + flag rows (idempotent), `result`
      read-back, `/api/dashboard` (grade joined to response)
- [x] Port engine + flag unit tests from `grader.test.ts`;
      `cargo test --test engine_tests` green (15 passing)
- [x] `cargo check --tests` clean, `cargo clippy --lib` no errors
- [ ] JSON API integration tests; full `cargo test` green (requires local Postgres)
