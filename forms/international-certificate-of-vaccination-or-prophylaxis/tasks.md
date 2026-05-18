# Tasks — International Certificate of Vaccination or Prophylaxis

## Specification

- [x] Author `index.md` — form description, IHR Annex 6 fields, validation rules
- [x] Author `AGENTS.md` — agent instructions and engine signature
- [x] Author `plan.md` — phased roadmap

## SQL migrations

- [x] `00_create_extensions.sql` — pgcrypto + pg_trgm
- [x] `01_create_function_set_updated_at.sql`
- [x] `02_create_table_patient.sql`
- [x] `03_create_table_clinician.sql`
- [x] `04_create_table_center.sql`
- [x] `05_create_table_international_certificate_of_vaccination_or_prophylaxis.sql`
- [x] `06_create_table_international_certificate_of_vaccination_or_prophylaxis_entry.sql`

## Generated representations

- [ ] XML + DTD pairs for every top-level entity
- [ ] FHIR R5 JSON resources (Patient, Practitioner, Organization, Immunization, DocumentReference)
- [ ] Protocol Buffers `.proto` files
- [ ] TypeSpec API surface

## Front-end form

- [ ] HTML static 8-step wizard (`front-end-form-with-html/`)
- [ ] SvelteKit 8-step wizard with Svelte 5 runes and Tailwind 4

## Front-end dashboard

- [ ] HTML review table with sample data
- [ ] SvelteKit SVAR DataGrid dashboard

## Full-stack backend

- [ ] `full-stack-with-loco-tera-htmx-alpine-setup` shell script
- [ ] Loco app scaffold
- [ ] Cargo workspace + migration sub-crate
- [ ] Tera base template with HTMX + Alpine CDN scripts
- [ ] Controller routes for certificate show, submit, report

## Verification

- [ ] `bin/test-form international-certificate-of-vaccination-or-prophylaxis` passes
