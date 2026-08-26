# Tasks: Perioperative Optimization

## Scaffolding

- [x] Run `bin/create-form perioperative-optimization`.
- [x] Verify the directory structure matches `bin/test-form` expectations.

## Documentation

- [x] `index.md` — domain table, gating model, 16-step wizard, safety flags.
- [x] `spec/index.md` — living domain spec and acceptance criteria.
- [x] `AGENTS.md` — engine shape, slug/spelling rule, "what this form is not".
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` (this file).
- [x] `doc/index.md` — reference-material index.
- [x] `doc/optimization-domains.md` — per-domain thresholds, interventions, lead times.
- [x] `doc/time-to-surgery-gating.md` — the gating model and worked examples.
- [x] `doc/medication-hold-rules.md` — SGLT2, GLP-1, anticoagulant, ACE-i guidance.
- [x] `doc/safety-case-notes.md` — DCB0129 / DCB0160 placeholders and hazards.

## Schema

- [x] `sql/00_create_extensions.sql`
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_clinician.sql`
- [x] `sql/04_create_table_medication.sql`
- [x] `sql/05_create_table_patient_medication.sql`
- [x] `sql/06_create_table_allergy.sql`
- [x] `sql/07_create_table_patient_allergy.sql`
- [x] `sql/08_create_table_perioperative_optimization.sql`
- [x] `sql/09_create_table_perioperative_optimization_grade.sql`
- [x] `sql/10_create_table_perioperative_optimization_grade_domain.sql`
- [x] `sql/11_create_table_perioperative_optimization_grade_flag.sql`
- [x] `sql/schema.sql` (generated, combined)
- [x] `bin/test-sql-apply perioperative-optimization` passes.

## Generated representations

- [x] `xml/`, `fhir/r5/`, `protobuf/`, `openapi/`
- [x] `back-end-with-loco-setup` — scaffold script.
- [x] `CHANGELOG.md` and `examples/`.
- [x] `llms.txt` and `forms.tsv`.

## Front-end with HTML

- [x] `index.html` — 16-step single-page wizard, Lily headless classes.
- [x] `dashboard.html` — review table with weeks-to-surgery and readiness.
- [x] `js/types.js` — assessment shape and display labels.
- [x] `js/domain-rules.js` — `DOMAIN_DEFINITIONS` and the eight triggers.
- [x] `js/gating.js` — time-to-surgery gating.
- [x] `js/composite-grader.js` — max-grade readiness + override.
- [x] `js/flagged-issues.js` — the safety-flag categories.
- [x] `js/form-app.js` / `js/dashboard-app.js` — controllers.
- [x] Header controls: locale, theme, text size, share.
- [x] `bin/es-modules-refactor --check` passes.
- [x] `bin/lily-html-refactor --check` passes.
- [x] `bin/test-e2e --html perioperative-optimization` passes.

## Front-end with SvelteKit

- [x] Project scaffold, Tailwind 4, Lily Svelte helpers, theme catalogue.
- [x] Root welcome page and nested routes.
- [x] `src/lib/engine/` — the engine in TypeScript.
- [x] Vitest tests on every domain threshold and both sides of each gate boundary.
- [x] PDF report endpoint via `pdfmake`.
- [x] `pnpm check`, `pnpm test`, and `pnpm build` pass.
- [x] Lily Svelte drift detectors pass.

## Back-end with Loco

- [x] Run `back-end-with-loco-setup` to scaffold the crate.
- [x] One migration + one entity per SQL table, relational (not JSONB).
- [x] `bin/route-loco-layout` applied.
- [x] `bin/loco-rs-1-migration` — loco-rs 1.0.1.
- [x] `bin/loco-config-refactor --check` passes.
- [x] `bin/loco-migration-defaults --check` passes.
- [x] `bin/loco-migration-nullability --check` passes.
- [x] `bin/generate-loco-deny-config.py --check` passes.
- [x] `cargo build` and `cargo test` pass.
- [ ] `cargo deny --all-features check` — fails on RUSTSEC-2023-0071 (`rsa`,
      transitive via SeaORM's MySQL driver). Fleet-wide: the canonical crate
      `forms/medical-operation-note/back-end-with-loco` fails identically.

## Verify

- [x] `bin/test-form perioperative-optimization` passes.
- [x] `bin/test-examples-conformance` passes.
- [x] `bin/generate-llms-txt.py --check` passes.
- [x] `bin/generate-spec.py --check` passes.
