# back-end-with-loco — tasks

- [x] Generate `back-end-with-loco-setup` scaffold script
- [x] Materialize the Loco crate (`Cargo.toml`, `src/`, `migration/`, `config/`)
- [x] Per-table relational SeaORM migrations in FK-dependency order (`users`, `patients`, `clinicians`, `cardiology_requests`, `cardiology_request_grades`, `cardiology_request_grade_rules`, `cardiology_request_grade_flags`)
- [x] One `_entities/*` entity + domain model per table, with relations and FKs (request → patient & clinician; grade → request 1:1; rule & flag → grade)
- [x] Port the four-axis vetting engine (rule IDs / flag IDs / bands / thresholds identical to TS) — preserved unchanged
- [x] JSON API controllers: `cardiology_request` CRUD; submit (transactional grade + rules + flags, idempotent); result; dashboard (request joined with grade)
- [x] Port `grader.test.ts` into `tests/engine/` (12 cases passing)
- [x] `cargo check --tests` clean; `cargo test --test engine_tests` green; `cargo clippy --lib` no errors
- [ ] Integration tests against a live Postgres `cardiology_request_test` database
