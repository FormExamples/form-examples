# Pulmonary Function Test Request — tasks

## Schema (source of truth)

- [x] `00_create_extensions.sql`, `01_create_function_set_updated_at.sql`
- [x] `02_create_table_patient.sql`, `03_create_table_clinician.sql`
- [x] `04_create_table_pulmonary_function_test_request.sql`
- [x] `05_…_grade.sql`, `06_…_grade_rule.sql`, `07_…_grade_flag.sql`

## Generated representations

- [ ] XML + DTD (`xml/`)
- [ ] FHIR R5 JSON (`fhir/r5/`)
- [ ] Protocol Buffers (`protobuf/`)
- [ ] OpenAPI 3.1 (`openapi/`)
- [ ] Loco setup script (`back-end-with-loco-setup`)
- [ ] `schema.sql`, `examples/`, `spec.md`, `CHANGELOG.md`

## Documentation

- [x] `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`
- [x] Subdirectory AI doc files + README symlinks
- [x] `doc/` clinical reference notes

## Front-ends

- [ ] `front-end-with-html`
- [ ] `front-end-with-svelte`
- [ ] `front-end-with-html`
- [ ] `front-end-with-svelte`

## Back-end

- [ ] `back-end-with-loco` Rust JSON API crate
- [ ] `cargo test` green (requires local Postgres)
