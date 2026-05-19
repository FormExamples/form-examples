# Tasks — Full-stack with Loco / Tera / HTMX / Alpine

## Scaffold

- [x] Top-level docs (`AGENTS.md`, `CLAUDE.md`, `index.md`, `plan.md`, `tasks.md`)
- [x] Nested crate `medical_information_form_for_air_travel/`
- [x] `Cargo.toml` with Loco 0.16, axum 0.8, SeaORM 1.1, tokio, serde, uuid, chrono
- [x] `.gitignore` for `/target`, `/node_modules`, `*.swp`
- [x] `src/bin/main.rs` binary entrypoint
- [x] `src/bin/cli.rs` CLI entrypoint
- [x] `src/app.rs` application wiring
- [x] `src/lib.rs` module re-exports
- [x] `src/controllers/mod.rs` registry
- [x] `src/models/mod.rs` registry
- [x] `src/views/mod.rs` registry
- [x] `src/tasks/mod.rs` registry
- [x] `src/workers/mod.rs` registry
- [x] `templates/base.html.tera` (HTMX 2.0.8 + Alpine.js 3.14.8 + `<body hx-boost="true">`)
- [x] `templates/assessment.html.tera`
- [x] `templates/assessment/step01.html.tera` ... `step14.html.tera`
- [x] `config/development.yaml`, `config/test.yaml`, `config/production.yaml`
- [x] `migration/` stub crate
- [x] `target/` placeholder directory
- [x] Sibling `full-stack-with-loco-tera-htmx-alpine-setup` shell script

## Schema migration

- [ ] Port `02_create_table_patient.sql` to SeaORM
- [ ] Port `03_create_table_clinician.sql` to SeaORM
- [ ] Port `04_create_table_medical_information_form_for_air_travel.sql`
- [ ] Port `05_create_table_medical_information_form_for_air_travel_grade.sql`
- [ ] Port `06_create_table_medical_information_form_for_air_travel_grade_rule.sql`
- [ ] Port `07_create_table_medical_information_form_for_air_travel_grade_flag.sql`
- [ ] `sea-orm-cli generate entity` and commit `_entities/`

## Grading engine

- [ ] `engine/cardiorespiratory.rs`
- [ ] `engine/recent_event.rs`
- [ ] `engine/pregnancy.rs`
- [ ] `engine/communicable.rs`
- [ ] `engine/equipment.rs`
- [ ] `engine/composite.rs` (max-grade aggregator)
- [ ] `engine/flagged_issues.rs`
- [ ] Unit tests mirroring the TypeScript engine tests

## Controllers and views

- [ ] `GET /` 14-step wizard
- [ ] `POST /assessment` draft persistence
- [ ] `POST /assessment/{id}/submit` grade + persist
- [ ] `GET /assessment/{id}` read-only report
- [ ] `views/report.rs` Tera template wiring

## Tests

- [ ] `tests/grading.rs` unit tests
- [ ] `tests/api.rs` integration tests with `loco-rs::testing`
- [ ] `bin/test-form medical-information-form-for-air-travel` green
