# Tasks: Eye Prescription — Rust Full-Stack

## Bootstrap
- [ ] Run `../full-stack-with-loco-tera-htmx-alpine-setup`.
- [ ] Confirm Postgres user `loco` and the three databases exist.
- [ ] Confirm `cargo loco start` serves the empty scaffold.

## Schema
- [ ] Re-author SeaORM migrations from `../sql-migrations/`.
- [ ] CHECK constraints preserved.
- [ ] COMMENT statements preserved.

## Engine
- [ ] `src/engine/refractive_rules.rs`.
- [ ] `src/engine/complexity_grader.rs`.
- [ ] `src/engine/flagged_issues.rs`.
- [ ] Engine unit tests in `tests/engine.rs`.

## Controllers
- [ ] `src/controllers/patient.rs`.
- [ ] `src/controllers/prescriber.rs`.
- [ ] `src/controllers/eye_prescription.rs`.
- [ ] `src/controllers/eye_prescription_eye.rs`.
- [ ] `src/controllers/eye_prescription_grade.rs` — triggers re-grade.

## Views
- [ ] `assets/views/base.html.tera` with HTMX 2.0.8 + Alpine.js 3.14.8.
- [ ] `assets/views/prescription/step1.html.tera` … `step11.html.tera`.
- [ ] `assets/views/dashboard/list.html.tera`.
- [ ] `assets/views/prescription/show.html.tera`.

## FHIR export
- [ ] `src/fhir/vision_prescription.rs`.
- [ ] Round-trip test against the JSON in `../fhir-r5/`.

## Verify
- [ ] `cargo build` passes.
- [ ] `cargo check` passes.
- [ ] `cargo test` passes.
- [ ] Browser smoke test (complete a prescription, export PDF, export FHIR).

## Deferred
- [ ] WebSocket live updates.
- [ ] Full FHIR validator.
- [ ] DCB0129 / DCB0160 clinical safety case.
