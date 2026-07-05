# back-end-with-loco — tasks

- [x] Materialise the Loco crate (`Cargo.toml`, `src/`, `migration/`, `config/`)
- [x] Per-table relational SeaORM migrations in FK-dependency order (`users`, `workers`, `managers`, `neurodiversity_adjustment_requests`, `neurodiversity_adjustment_request_grades`, `neurodiversity_adjustment_request_grade_rules`, `neurodiversity_adjustment_request_grade_flags`)
- [x] One `_entities/*` entity + domain model per table, with relations and FKs (request → worker & manager; grade → request 1:1; rule & flag → grade)
- [x] Four-axis grading engine (rule IDs / flag IDs / bands / thresholds identical to the canonical engine spec): eligibility, impact, completeness, priority + compliance / wellbeing flags
- [x] JSON API controllers: `neurodiversity_adjustment_request` CRUD; submit (transactional grade + rules + flags, idempotent); result; dashboard (request joined with grade)
- [x] Port the SvelteKit engine tests into `tests/engine/` (17 cases passing)
- [x] `cargo build` clean; `cargo test --test engine_tests` green
- [ ] Integration tests against a live Postgres `neurodiversity_adjustment_request_test` database
