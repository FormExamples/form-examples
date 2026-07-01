# Cardiology Request — tasks

## Schema (source of truth)

- [x] `00_create_extensions.sql`, `01_create_function_set_updated_at.sql`
- [x] `02_create_table_patient.sql`, `03_create_table_clinician.sql`
- [x] `04_create_table_cardiology_request.sql`
- [x] `05_…_grade.sql`, `06_…_grade_rule.sql`, `07_…_grade_flag.sql`

## Generated representations

- [x] XML + DTD (`xml/`)
- [x] FHIR R5 JSON (`fhir/`)
- [x] Protocol Buffers (`protobuf/`)
- [x] OpenAPI 3.1 (`openapi/`)
- [x] Loco setup script (`back-end-with-loco-setup`)
- [x] `schema.sql`, `examples/`, `spec/`, `CHANGELOG.md`

## Documentation

- [x] `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`
- [x] Subdirectory AI doc files + README symlinks
- [x] `doc/` clinical reference notes

## Front-ends

- [x] `front-end-with-html` (consolidated wizard + dashboard)
- [x] `front-end-with-svelte` (consolidated wizard + dashboard)

## Back-end

- [x] `back-end-with-loco` Rust JSON API crate (cargo check + engine tests pass)
- [ ] integration `cargo test` green (requires local Postgres)
