# UK Statement of Fitness for Work — Full Stack with Rust Axum Loco Tera

Server-rendered Rust web application implementing the UK Med 3 / fit note
ten-step single-page wizard, the DWP-policy compliance grader, and the
eighteen-flag safety catalogue.

## Stack

- Rust edition 2024
- axum 0.8 HTTP routing
- Tera templates (server-rendered)
- HTMX 2.0.8 for progressive enhancement (boosted links and forms)
- Alpine.js 3.14.8 for client-side step navigation and conditional
  branches inside the wizard
- In-memory `Store` (process-local `HashMap<Uuid, FitNote>`) for the
  development build; the SeaORM 1.1 + PostgreSQL persistence layer is
  scaffolded by the sibling
  [`../full-stack-with-loco-tera-htmx-alpine-setup`](../full-stack-with-loco-tera-htmx-alpine-setup)
  shell script and runs against the seven tables in
  [`../sql-migrations/`](../sql-migrations).

## Routes

| Method | Path                              | Purpose                                    |
| ------ | --------------------------------- | ------------------------------------------ |
| GET    | `/`                               | Landing page                               |
| POST   | `/fit-note/new`                   | Create a new fit-note draft, redirect      |
| GET    | `/fit-note/{id}`                  | Render the ten-step single-page wizard     |
| POST   | `/fit-note/{id}/submit`           | Persist form data, redirect to report      |
| GET    | `/fit-note/{id}/report`           | Render the graded fit-note report          |

## Grading engine

Ported from
[`../front-end-form-with-html/js/grader.js`](../front-end-form-with-html/js/grader.js).
The engine is structured as:

- `src/grading/types.rs` — strongly-typed `FitNote`, `Clinician`,
  `MedicalPractice`, `Patient`, `Grade`, `FiredRule`, `SafetyFlag`
  structs with `serde(rename_all = "camelCase")`.
- `src/grading/utils.rs` — period-days computation and adaptation count.
- `src/grading/validity_rules.rs` — DWP policy 3.6 / 3.7 validity rules.
- `src/grading/adaptation_rules.rs` — adaptation intensity classification.
- `src/grading/period_rules.rs` — period compliance classification.
- `src/grading/safety_flag_rules.rs` — the eighteen-flag catalogue.
- `src/grading/grader.rs` — `grade_fit_note(&FitNote) -> Grade` entry
  point.

## Layout

```
full-stack-with-loco-tera-htmx-alpine/
  Cargo.toml                                # crate manifest (axum + Tera + serde)
  .gitignore                                # /target
  src/
    main.rs                                 # axum bootstrap, Tera glob, in-memory store
    controllers/
      mod.rs
      fit_note.rs                           # 5 HTTP handlers + form parser
    views/
      mod.rs
      fit_note.rs                           # Tera context builders
    grading/
      mod.rs                                # re-exports
      types.rs
      utils.rs
      validity_rules.rs
      adaptation_rules.rs
      period_rules.rs
      safety_flag_rules.rs
      grader.rs
  templates/
    base.html.tera                          # HTMX 2.0.8 + Alpine.js 3.14.8 + hx-boost body
    home/
      index.html.tera                       # landing page
    fit_note/
      form.html.tera                        # ten-step single-page wizard
      report.html.tera                      # graded report
  target/                                   # cargo build artefacts (gitignored)
  tests/
    grader_test.rs                          # end-to-end grader assertions
```

## Run

```sh
cd full-stack-with-loco-tera-htmx-alpine
cargo run
# open http://127.0.0.1:3000/
```

## Test

```sh
cd full-stack-with-loco-tera-htmx-alpine
cargo test
```

## Verify

```sh
bin/test-form united-kingdom-statement-of-fitness-for-work
```
