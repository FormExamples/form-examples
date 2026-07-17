# Pathology Waiting List Card — full-stack Rust crate plan

Implementation plan for the Loco/axum/Tera/HTMX/Alpine.js full-stack
crate. The crate mirrors the canonical layout used by
`forms/advance-decision-to-refuse-treatment/back-end-with-loco`.

## Components

1. Cargo workspace with a `migration` sub-crate (SeaORM migrations).
2. Loco `App` hooks in `src/app.rs`, binary entry point in
   `src/bin/main.rs`.
3. `assessments` SeaORM entity backed by a single Postgres table whose
   JSONB `data` column stores the seven-step card payload.
4. Pure scoring engine in `src/engine/`:
   - `types.rs` — serde structs (`Card`, `Practitioner`, `Patient`,
     `Referral`, `WaitingList`, `Appointment`, `Communication`,
     `Signoff`, `GradingResult`).
   - `priority_targets.rs` — `PRIORITY_TARGET_WEEKS`, `targetWaitWeeks`,
     date helpers.
   - `waiting_time_rules.rs` — band-classification rules (P6 removed,
     long-wait, breached priority/RTT, approaching breach, within
     target).
   - `composite_grader.rs` — wraps the band classifier and computes
     days-to-target / days-to-breach / days-to-appointment.
   - `flagged_issues.rs` — eight operational flags (long-wait, P1
     escalation, 2-week-wait cancer, missing appointment, interpreter,
     accessibility, contact details).
   - `utils.rs` — display helpers.
5. Controllers in `src/controllers/`:
   - `assessment.rs` — landing, create, show, submit, report.
   - `dashboard.rs` — completed-card list with filters.
6. View helpers in `src/views/`:
   - `assessment.rs` — `build_assessment_context`.
   - `dashboard.rs` — `PatientRow` projection.
7. Tera templates in `templates/`:
   - `base.html.tera` (HTMX 2.0.8 + Alpine.js 3.14.8, `<body hx-boost="true">`).
   - `landing.html.tera`, `assessment.html.tera`, `dashboard.html.tera`,
     `report.html.tera`.
   - `assessment/step01.html.tera` … `step07.html.tera` (7-step wizard).
8. Engine tests in `tests/engine/`:
   - `composite_grader_test.rs` (band-classification scenarios).
   - `flagged_issues_test.rs` (per-flag scenarios + priority sort).

## Status

- Cargo workspace and migration crate: implemented.
- App hooks, controllers, models, views: implemented.
- Scoring engine: implemented (ported from the TypeScript engine in
  `front-end-with-html/js/`).
- Templates: implemented (single-page 7-step wizard).
- Engine tests: implemented.
- `cargo build` and `cargo check`: pass.
- `cargo test` requires a running Postgres instance (out of scope for
  this crate's bootstrap).
