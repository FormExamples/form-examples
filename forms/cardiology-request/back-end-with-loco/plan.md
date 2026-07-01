# back-end-with-loco — plan

Rust axum + Loco JSON API for the Cardiology Request. The crate mirrors the
canonical **relational** Loco back-end (see
`forms/medical-operation-note/back-end-with-loco/`): one Loco migration and one
SeaORM `_entity` per SQL table, the four-axis vetting engine under
`src/engine/`, and JSON controllers under `src/controllers/`.

- [x] Setup script generated from `sql/`
- [x] Loco crate materialised (`Cargo.toml`, `src/`, `migration/`, `config/`)
- [x] Per-table relational migrations in FK-dependency order: `users`,
      `patients`, `clinicians`, `cardiology_requests`,
      `cardiology_request_grades`, `cardiology_request_grade_rules`,
      `cardiology_request_grade_flags`
- [x] One `_entities/*` per table + domain models (with relations + FKs:
      request → patient & clinician; grade → request 1:1; rule & flag → grade)
- [x] four-axis vetting engine port (`src/engine/`) with TS parity — unchanged
- [x] JSON API: request CRUD; submit (transactional grade + rules + flags,
      idempotent delete-then-insert); result (grade + rules + flags); dashboard
      (request joined with grade)
- [x] `cargo check --tests` clean; ported engine tests green (`cargo test --test engine_tests`); `cargo clippy --lib` no errors
- [ ] Full `cargo test` (integration) requires a local Postgres test database
