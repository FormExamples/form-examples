# Tasks: Rust full-stack

## Scaffold
- [ ] Run `../full-stack-with-loco-tera-htmx-alpine-new/00-new.sh`.
- [ ] Confirm `Cargo.toml`, `.gitignore`, `src/`, `target/` are
      created.
- [ ] Confirm `templates/base.html.tera` contains the required HTMX
      and Alpine.js CDN tags plus `<body hx-boost="true">`.

## Migrations
- [ ] Port `00_create_extensions.sql` to SeaORM.
- [ ] Port `01_create_function_set_updated_at.sql` to SeaORM.
- [ ] Port `02_create_table_patient.sql`.
- [ ] Port `03_create_table_clinician.sql`.
- [ ] Port `04_create_table_employer.sql`.
- [ ] Port `05_create_table_return_to_work.sql`.
- [ ] Port `06_create_table_return_to_work_restriction.sql`.
- [ ] Port `07_create_table_return_to_work_grade.sql`.
- [ ] Port `08_create_table_return_to_work_grade_rule.sql`.
- [ ] Port `09_create_table_return_to_work_grade_flag.sql`.

## Engine
- [ ] `src/services/grader/types.rs`.
- [ ] `src/services/grader/fitness_rules.rs`.
- [ ] `src/services/grader/restriction_rules.rs`.
- [ ] `src/services/grader/flagged_issues.rs`.
- [ ] `src/services/grader/composite_grader.rs`.
- [ ] Unit tests for each.

## Templates
- [ ] `templates/layouts/base.html.tera`.
- [ ] `templates/assessment/step_1.html.tera` through `step_12`.
- [ ] `templates/assessment/report.html.tera`.

## Controllers
- [ ] `GET /assessment/new`.
- [ ] `GET /assessment/:id/step/:n`.
- [ ] `POST /assessment/:id/step/:n`.
- [ ] `GET /assessment/:id/report`.
- [ ] `GET /assessment/:id/pdf`.
- [ ] JSON API controllers under `/api/v1/`.

## Tests
- [ ] `cargo build`.
- [ ] `RUSTFLAGS=-Awarnings cargo check`.
- [ ] `cargo test`.
