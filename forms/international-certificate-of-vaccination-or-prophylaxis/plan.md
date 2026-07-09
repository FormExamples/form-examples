# Implementation Plan — International Certificate of Vaccination or Prophylaxis

## Status: in progress

## Phase 1 — Specification

- [x] Author `index.md` describing form, IHR Annex 6 legal basis, validation rules
- [x] Author `AGENTS.md` with engine signature and domain model
- [x] Author `plan.md` (this file) and `tasks.md`

## Phase 2 — Schema & data model

- [x] `sql/00_create_extensions.sql`
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql` — vaccinee
- [x] `sql/03_create_table_clinician.sql` — supervising clinician
- [x] `sql/04_create_table_center.sql` — WHO-designated centre
- [x] `sql/05_create_table_international_certificate_of_vaccination_or_prophylaxis.sql`
- [x] `sql/06_create_table_international_certificate_of_vaccination_or_prophylaxis_entry.sql`

## Phase 3 — Generated representations

- [ ] `xml/*.xml` + `*.dtd` (via `bin/xml-representations/generate-xml-representations.py`)
- [ ] `fhir/r5/*.json` (via `bin/fhir-r5/generate-fhir-r5-representations.py`)
- [ ] `protobuf/*.proto` (via `bin/protobuf/generate-protobuf-representations.py`)
- [ ] `typespec/main.tsp`

## Phase 4 — Front-ends

- [ ] `front-end-with-html/` — static 8-step wizard
- [ ] `front-end-with-svelte/` — SvelteKit 5 + Tailwind 4 wizard
- [ ] `front-end-with-html/` — static review table
- [ ] `front-end-with-svelte/` — SVAR DataGrid review dashboard

## Phase 5 — Full-stack backend

- [ ] `back-end-with-loco-setup` — scaffold generator script
- [ ] `back-end-with-loco/` — Rust Loco crate
- [ ] HTMX + Alpine.js base layout (`templates/base.html.tera`)
- [ ] SeaORM migrations mirroring `sql/`
- [ ] Validation engine port to Rust
- [ ] Controller routes: GET show, POST submit, GET report

## Phase 6 — Verification

- [ ] `bin/test-form international-certificate-of-vaccination-or-prophylaxis` passes
- [ ] All XML files validate against their DTDs (`xmllint --valid`)
- [ ] FHIR R5 Bundle validates against the R5 schema
- [ ] SvelteKit projects pass `pnpm run check`
- [ ] Loco crate builds and tests pass

## Out of scope

- Issuance-authority signing keys (HSM integration).
- WHO-DDCC (Digital Documentation of COVID-19 Certificates) — separate
  specification with a different signing scheme.
- EU Digital COVID Certificate (DCC) — separate specification.
- Mobile-wallet integration (Apple Health / Google Wallet) — future work.
