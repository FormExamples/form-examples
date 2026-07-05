# back-end-with-loco — plan

Rust axum + Loco JSON API for the Neurodiversity Adjustment Request. The crate
mirrors the canonical **relational** Loco back-end (see
`forms/cardiology-request/back-end-with-loco/`): one Loco migration and one
SeaORM `_entity` per SQL table, the four-axis grading engine under
`src/engine/`, and JSON controllers under `src/controllers/`.

- [x] Loco crate materialised (`Cargo.toml`, `src/`, `migration/`, `config/`)
- [x] Per-table relational migrations in FK-dependency order: `users`,
      `workers`, `managers`, `neurodiversity_adjustment_requests`,
      `neurodiversity_adjustment_request_grades`,
      `neurodiversity_adjustment_request_grade_rules`,
      `neurodiversity_adjustment_request_grade_flags`
- [x] One `_entities/*` per table + domain models (with relations + FKs:
      request → worker & manager; grade → request 1:1; rule & flag → grade)
- [x] Four-axis grading engine (`src/engine/`) with TS parity — eligibility,
      impact, completeness, priority + compliance flags; rule / flag IDs match
      the canonical engine spec
- [x] JSON API: request CRUD; submit (transactional grade + rules + flags,
      idempotent delete-then-insert); result (grade + rules + flags); dashboard
      (request joined with grade)
- [x] `cargo build` clean (`#![deny(missing_docs)]`); ported engine tests green
      (`cargo test --test engine_tests`)
- [ ] Full `cargo test` (integration) requires a local Postgres test database
