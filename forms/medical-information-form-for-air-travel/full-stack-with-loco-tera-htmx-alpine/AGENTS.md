# Full-stack — Medical Information Form for Air Travel (MEDIF)

Rust full-stack implementation of the airline **Medical Information Form
(MEDIF)** single-page wizard. The backend serves a server-rendered HTMX UI
backed by Tera templates and Alpine.js progressive-enhancement.

## Stack

- Rust (edition 2021)
- Loco 0.16 framework on axum 0.8 (target)
- SeaORM 1.1 with PostgreSQL 18
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Directory layout

```
full-stack-with-loco-tera-htmx-alpine/
  AGENTS.md                                  this file
  CLAUDE.md                                  -> AGENTS.md
  index.md                                   form overview
  plan.md                                    implementation roadmap
  tasks.md                                   task checklist
  README.md                                  -> index.md
  medical_information_form_for_air_travel/   nested Rust crate
    Cargo.toml
    .gitignore
    src/
      bin/main.rs                            binary entrypoint
      bin/cli.rs                             CLI entrypoint
      app.rs                                 application wiring
      lib.rs                                 module re-exports
      controllers/mod.rs                     HTTP handlers registry
      models/mod.rs                          SeaORM entities registry
      views/mod.rs                           view helpers registry
      tasks/mod.rs                           Loco tasks registry
      workers/mod.rs                         background workers registry
    templates/
      base.html.tera                         base layout (HTMX + Alpine.js)
      assessment.html.tera                   wizard container
      assessment/step01.html.tera ... step14.html.tera
                                             14 single-page wizard steps
    config/
      development.yaml                       dev DB + server config
      test.yaml                              test DB + server config
      production.yaml                        prod DB + server config
    migration/                               sea-orm-migration crate stub
    target/                                  cargo build artefacts
```

The nested crate name mirrors the form slug as snake_case:
`medical_information_form_for_air_travel`.

## Forms wizard (14 single-page steps)

The wizard renders all 14 steps on one page; HTMX is used for inline field
updates and partial reloads. Alpine.js drives conditional visibility (e.g.
pregnancy section appears when `isPregnant === 'yes'`).

1. Submitting agent
2. Passenger identity
3. Trip details
4. Reason for MEDIF
5. Attending physician
6. Diagnosis
7. Cardiovascular
8. Respiratory
9. Recent events and surgery
10. Pregnancy
11. Communicable disease
12. In-flight requirements
13. Cabin medications and equipment
14. Sign-off

## Build and run

```sh
cd medical_information_form_for_air_travel
cargo build
cargo check
```

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
```

## Generate scaffolds

The sibling setup script reproducibly regenerates the Loco scaffold:

```sh
../full-stack-with-loco-tera-htmx-alpine-setup
```

Tables are scaffolded in the same order as `sql-migrations/` so foreign-key
targets exist before referencing tables.

## Conventions

- snake_case in SQL and Rust source
- camelCase in serde JSON (`#[serde(rename_all = "camelCase")]`)
- UUIDv4 primary keys, `created_at` / `updated_at` / `deleted_at` on every
  table
- Empty string `''` for unanswered text/enum fields; `NULL` for unanswered
  numeric and date fields
