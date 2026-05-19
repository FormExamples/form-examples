# WHO Surgical Safety Checklist — Implementation Plan

Implementation roadmap for the WHO Surgical Safety Checklist form.

## Phase 1 — Specification

- [x] Author `index.md` with the three-phase checklist, completion semantics,
      and safety-flag rules.
- [x] Author `AGENTS.md` with the data model and per-phase field list.
- [x] Author `plan.md` and `tasks.md`.

## Phase 2 — Data layer

- [x] `sql-migrations/00_create_extensions.sql` (pgcrypto).
- [x] `sql-migrations/01_create_function_set_updated_at.sql`.
- [ ] `sql-migrations/02_create_table_patient.sql`.
- [ ] `sql-migrations/03_create_table_clinician.sql`.
- [ ] `sql-migrations/04_create_table_who_surgical_safety_checklist.sql`.
- [ ] `sql-migrations/05_create_table_team_member.sql`.

## Phase 3 — Generated representations

- [ ] Run `bin/xml-representations/generate-xml-representations.py` →
      DTD + XML per table.
- [ ] Run `bin/fhir-r5/generate-fhir-r5-representations.py` → JSON per table.
- [ ] Run `bin/protobuf/generate-protobuf-representations.py` → `.proto` per
      table.
- [ ] Author TypeSpec definitions per table under `typespec/`.

## Phase 4 — Static HTML wizard (`front-end-form-with-html`)

- [ ] Single-page wizard: case details → Sign In → Time Out → Sign Out →
      Summary.
- [ ] LocalStorage persistence, JSON / XML / CSV / TSV export.
- [ ] Print-friendly summary page.

## Phase 5 — SvelteKit wizard (`front-end-form-with-svelte`)

- [ ] Scaffold with `npm create svelte@latest` (TypeScript + Tailwind 4).
- [ ] Implement step components `Step0CaseDetails`, `Step1SignIn`,
      `Step2TimeOut`, `Step3SignOut`, `Step4Summary`.
- [ ] Implement `lib/checklist/types.ts`, `lib/checklist/flags.ts`,
      `lib/checklist/completion.ts`.
- [ ] PDF export with `pdfmake`.
- [ ] Vitest tests for `flags.ts` and `completion.ts`.

## Phase 6 — HTML dashboard (`front-end-dashboard-with-html`)

- [ ] Static HTML table view of completed checklists with filter / sort.

## Phase 7 — SvelteKit dashboard (`front-end-dashboard-with-svelte`)

- [ ] SVAR DataGrid review dashboard with status / specialty / flag filters.

## Phase 8 — Full-stack Rust (`full-stack-with-loco-tera-htmx-alpine`)

- [ ] Author `full-stack-with-loco-tera-htmx-alpine-setup` script with the
      `cargo loco generate scaffold` invocations for each table.
- [ ] Run the setup script to generate the application.
- [ ] Customise templates with HTMX + Alpine.js for the three-phase wizard.

## Phase 9 — Verification

- [ ] `bin/test-form who-surgical-safety-checklist` passes.
- [ ] Manual walk-through of the three phases in each front-end.
