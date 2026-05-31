# Medical Operation Note — Rust full-stack

Server-rendered Rust web application that implements the medical-operation-note
12-step single-page wizard, composite operative-risk grader, safety flags and
signed-PDF report endpoint.

## Stack

- Rust edition 2024 (toolchain stable)
- [Loco 0.16](https://loco.rs/) on [axum 0.8](https://crates.io/crates/axum)
- [SeaORM 1.1](https://www.sea-ql.org/SeaORM/) on PostgreSQL 18
- [Tera 1.20](https://keats.github.io/tera/) for server-rendered templates
- [HTMX 2.0.8](https://htmx.org/) and [Alpine.js 3.14.8](https://alpinejs.dev/)
  for navigation boosting and client-side conditionals
- [fluent-templates 0.13](https://crates.io/crates/fluent-templates) for i18n
  (graceful-degradation initialiser — see `src/initializers/view_engine.rs`)

## Layout

```text
full-stack-with-loco-tera-htmx-alpine/
  00-new.sh                              # one-time bootstrap (loco new, createdb)
  index.md / AGENTS.md / plan.md / tasks.md
  templates/base.html.tera               # test-form contract base template
  Cargo.toml -> medical_operation_note/Cargo.toml
  src       -> medical_operation_note/src
  tests     -> medical_operation_note/tests
  assets    -> medical_operation_note/assets
  config    -> medical_operation_note/config
  migration -> medical_operation_note/migration
  target    -> medical_operation_note/target
  medical_operation_note/                # Loco crate (snake_case, per canonical)
    src/
      app.rs                             # Hooks impl + routes() registration
      engine/                            # composite grader + sub-rules
        composite_grader.rs              # max-grade aggregator
        blood_loss_rules.rs              # EBL banding -> grade contribution
        clavien_dindo_rules.rs           # I/II/IIIa/IIIb/IVa/IVb/V mapping
        count_rules.rs                   # swab/needle/instrument + retained
        never_event_rules.rs             # wrong-site, arrest, etc.
        anaesthetic_event_rules.rs       # failed intubation, anaphylaxis...
        flagged_issues.rs                # safety-flag emitter
        types.rs                         # camelCase serde data model
      controllers/
        operation_note.rs                # /operation-note wizard
        medical_operation_note*.rs       # Loco scaffolded CRUD (13 tables)
      models/_entities/                  # SeaORM-generated entities
    migration/                           # SeaORM migration crate (14 migrations)
    assets/views/
      base.html                          # runtime base (HTMX 2.0.8, Alpine, hx-boost)
      operation_note/
        index.html                       # wizard page - extends base.html
        report.html                      # computed-grade preview
        steps/step01_identification.html
        steps/step02_patient.html
        steps/step03_team.html
        steps/step04_diagnoses.html
        steps/step05_anaesthesia.html
        steps/step06_position.html
        steps/step07_findings.html
        steps/step08_materials.html
        steps/step09_drains.html
        steps/step10_safety.html
        steps/step11_post_op.html
        steps/step12_summary.html
    config/                              # development.yaml, test.yaml
    tests/
      engine/mod.rs                      # integration tests for the grader
      models/                            # auto-generated SeaORM model tests
      requests/                          # auto-generated auth/CRUD request tests
```

## Routes

| Method | Path                              | Handler                              |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/operation-note`                 | `operation_note::show_wizard`        |
| POST   | `/operation-note/submit`          | `operation_note::submit_wizard`      |
| GET    | `/operation-note/report`          | `operation_note::show_report`        |
| POST   | `/operation-note/report.pdf`      | `operation_note::download_pdf` stub  |
| *      | `/patients`, `/clinicians`, ...   | Loco scaffolded CRUD per table       |

## Commands

```sh
# Inside medical_operation_note/
cargo build
cargo loco db migrate -e development
cargo loco db migrate -e test
cargo test
cargo loco start                    # http://localhost:5150/operation-note
```

## Verify

```sh
cd /path/to/form-examples
bin/test-form medical-operation-note
```

Expectations:
- `cargo build` clean
- `cargo check` clean
- `cargo test` - 25 engine unit tests + 41 integration tests pass
- `templates/base.html.tera` contains the pinned HTMX, Alpine, and `hx-boost="true"` strings.
