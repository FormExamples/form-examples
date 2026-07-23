# Tasks: Pre-operative Assessment

## Completed

- [x] Implement patient form frontend (16 steps, 11 body systems)
- [x] Implement ASA grading engine (42 declarative rules)
- [x] Implement 20+ safety flag detection
- [x] Implement PDF report generation
- [x] Implement clinician dashboard with SVAR DataGrid
- [x] Implement Rust backend with engine types
- [x] Add Vitest unit tests for grading logic
- [x] Create PostgreSQL database schema (22 tables)
- [x] Create comprehensive documentation (12 doc files)
- [x] Create project documentation (index.md, AGENTS.md, plan.md, tasks.md)

## In progress (2026-07-23)

Fields researched from onehealthcare.co.uk pre-assessment questionnaire and
added to the Svelte engine/front-end earlier were missing from SQL/generated
representations/Rust backend. Continuing the build-out:

- [x] SQL: `sql/09_alter_table_pre_operative_assessment_by_patient_add_fields.sql`
      — 39 new columns (cancer/MRSA history, cardiovascular/respiratory/
      renal/haematological/musculoskeletal/GI/social/functional-capacity/
      pregnancy additions, new CognitiveMentalHealth section). Verified
      applies cleanly against the full migration stack.
- [x] Regenerated XML, FHIR R5, protobuf, OpenAPI representations.
- [x] Rust back-end-with-loco updated to match: new migration + 39 new
      entity/controller fields. Verified via `cargo check` (clean) and
      `cargo test` (29/29 passing) and `bin/test-form` (PASS).
- [x] front-end-with-html/ — 39 new fields added to existing steps, plus a
      new step 17 "Cognitive and Mental Health" (TOTAL_STEPS 16 -> 17).
      Verified via Playwright (17 step-list items, step 17 renders with
      7 field groups, conditional reveals work, 0 console errors) and
      `bin/lily-html-refactor --check` (0 risky lines).

## Pending

- [ ] Add Zod input validation schemas
- [ ] Add Playwright end-to-end tests
- [ ] Add accessibility audit
- [ ] Add form autosave to localStorage
- [ ] Enhance backend database migrations
- [ ] Extend clinical safety case documentation
- [ ] GDPR data processing impact assessment
- [ ] DCB0129 clinical risk management compliance review
