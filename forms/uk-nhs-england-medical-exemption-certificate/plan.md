# Plan — UK NHS England Medical Exemption Certificate (FP92A)

## Goal

Deliver a complete digital implementation of the **FP92A medical exemption
application form** suitable for use as a NHS general practice staging tool
ahead of printing and posting to NHSBSA Bridge House.

## Phase 1 — Foundational design

- [x] `index.md` — form description, source, scoring, 10-step wizard, output.
- [x] `AGENTS.md` — agent-facing instructions, conventions, stacks.
- [x] `plan.md` — this file.
- [x] `tasks.md` — task index.
- [x] SQL migrations — canonical Postgres schema (patient, practitioner,
      eligible_condition, application, application_eligible_condition,
      grade, grade_fired_rule, grade_additional_flag).

## Phase 2 — Representations (derived from SQL)

- [x] `xml-representations/` — XML + DTD per SQL table.
- [x] `fhir-r5/` — FHIR HL7 R5 JSON resources mapped to the schema.
- [x] `protobuf/` — `.proto` schemas per SQL table.
- [x] `typespec/` — TypeSpec models for API-first integration.
- [x] `doc/` — reference notes covering NHSBSA guidance and the 10
      qualifying conditions.

## Phase 3 — Front-ends

- [x] `front-end-form-with-html/` — single-page HTML wizard.
- [x] `front-end-form-with-svelte/` — SvelteKit wizard scaffold.
- [x] `front-end-dashboard-with-html/` — static HTML review table.
- [x] `front-end-dashboard-with-svelte/` — SVAR DataGrid dashboard scaffold.

## Phase 4 — Full stack

- [x] `full-stack-with-loco-tera-htmx-alpine-setup` — shell script of
      `cargo loco generate scaffold` calls aligned with the SQL.
- [x] `full-stack-with-loco-tera-htmx-alpine/` — Rust axum + Tera + HTMX +
      Alpine.js crate with a working wizard and grade report.

## Phase 5 — Verification

- [x] `bin/test-form uk-nhs-england-medical-exemption-certificate` passes
      without errors.

## Notes

- The FP92A is a **paper-only** submission. The NHSBSA explicitly rejects
  scans, photocopies, downloads, and printouts. The digital form is a
  practitioner-side staging and review tool, not a submission channel.
- Eligibility is a binary administrative determination — not a clinical risk
  score. The "grade" surface is kept for monorepo consistency.
