# back-end-with-loco — plan

Rust axum + Loco JSON API for the Cardiology Response. The crate mirrors the
**relational** `medical-operation-note` template: one Loco migration and one
SeaORM `_entity` per SQL table (plus the Loco-default `users` table), the
four-axis interpretation engine under `src/engine/`, and JSON controllers under
`src/controllers/`. Primary keys are auto-increment integers and `created_at` /
`updated_at` are added by Loco's `create_table` helper; every domain table also
carries `deleted_at`. The scaffold contract is documented in
`../back-end-with-loco-setup` (one `cargo loco generate scaffold --api` per SQL
table, in FK-dependency order).

- [x] Setup script generated from `sql/`
- [x] Loco crate materialized (`Cargo.toml`, `src/`, `migration/`, `config/`)
- [x] Relational migrations: `users`, `patients`, `clinicians`,
      `cardiology_responses`, `cardiology_response_grades` (1:1 unique FK),
      `cardiology_response_grade_rules`, `cardiology_response_grade_flags`
- [x] SeaORM entities + domain models, one per table, with FK relations
- [x] four-axis interpretation engine port (`src/engine/`) — identical R-* / F-*
      rule and flag IDs, axes, bands, and thresholds as the Svelte engine
      (preserved unchanged during the relational refactor)
- [x] JSON API: CRUD on `/api/cardiology_responses`, `submit` (transactional
      persist of grade + rules + flags, idempotent), `result`, `/api/dashboard`
      (grade joined to response)
- [x] engine + flag tests ported from `grader.test.ts` (`tests/engine/`),
      `cargo test --test engine_tests` green
- [ ] `cargo test` green for the JSON API integration path (requires local
      Postgres test database)
