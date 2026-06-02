# Plan - Rust full-stack backend for medical-operation-note

## Status

All items below are complete. The backend builds, all 66 tests pass,
and `bin/test-form medical-operation-note` clears the full-stack
checks (`Cargo.toml`, `src/`, `target/`, `templates/base.html.tera`
with the required HTMX/Alpine/`hx-boost` strings).

## Phase 1 - App scaffolding

- [x] `00-new.sh`: create `loco` postgres user and the
      `medical_operation_note_{development,test,production}` databases.
- [x] `loco new --name medical-operation-note --db postgres --bg async
      --assets serverside -a` to produce the SaaS starter, renamed to
      snake_case `medical_operation_note/`.
- [x] Outer-dir symlinks (`Cargo.toml`, `src`, `tests`, `assets`,
      `config`, `migration`, `target`, `.gitignore`) so `bin/test-form`
      sees a crate at `back-end-with-loco/`.

## Phase 2 - Database schema

- [x] Run the generated setup script (`bash
      back-end-with-loco-setup`) with `:ts`->`:tstz`
      patch.
- [x] All 13 op-note tables scaffolded: `patients`, `clinicians`,
      `medical_operation_notes`, `medical_operation_note_team_members`,
      `_procedures`, `_steps`, `_implants`, `_drains`, `_specimens`,
      `_complications`, `_grades`, `_grade_rules`, `_grade_flags`.
- [x] FK fix in `medical_operation_notes` migration:
      `lead_surgeon_id -> clinicians.id`.
- [x] `cargo loco db migrate` applied to both development and test
      databases; entities regenerated via `cargo loco db entities`.

## Phase 3 - Composite-grading engine

- [x] `src/engine/types.rs` - camelCase data model
      (`OperationNote`, `OperationGrade`, `CompositeRisk`,
      `ClavienDindo`, `BloodLossBand`, `FlagPriority`, `FiredRule`,
      `AdditionalFlag`).
- [x] `blood_loss_rules.rs` - EBL banding (Minimal / Mild / Moderate /
      Severe / Massive) and grade contributions.
- [x] `clavien_dindo_rules.rs` - Clavien-Dindo 0/I/II/IIIa/IIIb/IVa/IVb/V
      mapping.
- [x] `count_rules.rs` - swab / needle / instrument + retained foreign
      body.
- [x] `never_event_rules.rs` - never-event candidates and
      intra-operative arrest.
- [x] `anaesthetic_event_rules.rs` - failed intubation, anaphylaxis,
      etc.
- [x] `flagged_issues.rs` - safety-flag emitter (high/medium/low).
- [x] `composite_grader.rs` - max-grade aggregator with ASA modifier
      and unplanned-disposition step-up.
- [x] Unit tests in each file (25 tests total).
- [x] Integration tests at `tests/engine/mod.rs` (5 additional
      scenarios).

## Phase 4 - Wizard UI

- [x] `assets/views/base.html` rewritten to use HTMX 2.0.8 + Alpine
      3.14.8 (defer) and `hx-boost="true"`.
- [x] `templates/base.html.tera` mirrors the required strings for the
      bin/test-form contract.
- [x] `assets/views/operation_note/index.html` - single-page wizard
      that extends `base.html` and includes 12 step partials.
- [x] `assets/views/operation_note/steps/step01-step12.html` -
      every step a self-contained `<section>` (no nested forms).
- [x] `assets/views/operation_note/report.html` - fired-rules /
      safety-flags preview.
- [x] Alpine.js client-side conditionals (tourniquet detail on
      step 6; live grade preview using simple rank math).

## Phase 5 - Controller, routes

- [x] `src/controllers/operation_note.rs` with `WizardForm`,
      `to_operation_note()` conversion, and four handlers
      (`show_wizard`, `submit_wizard`, `show_report`, `download_pdf`).
- [x] Routes mounted at `/operation-note/*` via `routes()`.
- [x] Registration in `src/app.rs` and `src/controllers/mod.rs`.

## Phase 6 - Verification

- [x] `cargo build` - clean.
- [x] `cargo check` - clean (warnings allowed under `RUSTFLAGS=-Awarnings`).
- [x] `cargo test` - 25 + 41 = 66 tests pass.
- [x] `bin/test-form medical-operation-note` clears every full-stack
      contract error (`Cargo.toml`, `src/`, `target/`,
      `templates/base.html.tera`, htmx/alpine/`hx-boost` greps,
      `cargo build`, `cargo check`, `cargo test`).

## Known follow-ups (not blocking this deliverable)

- The `download_pdf` route is a `text/plain` stub. A real signed-PDF
  generator (`printpdf`, `weasyprint`, or `pdfmake-server`) and a
  signature flow tied to the surgeon's GMC need adding.
- The wizard does not yet persist to the `medical_operation_notes`
  table on submit; it computes and renders the grade in-memory. Wiring
  the form payload into the SeaORM `ActiveModel` is straightforward
  given the scaffolded models.
- The Loco-generated `assets/views/base.html` is shared with the
  scaffolded CRUD pages; the `hx-boost` body attribute may interact
  with the scaffold's vanilla form submissions and would benefit from
  a quick QA pass.
