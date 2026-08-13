# Tasks: Dietetic Assessment

## Scaffolding

- [x] Run `bin/create-form dietic-assessment`.
- [x] Verify the directory structure matches `bin/test-form` expectations.

## Documentation

- [x] `index.md` — 16-step wizard table, MUST/GLIM scoring, safety flags.
- [x] `spec/index.md` — living domain spec and acceptance criteria.
- [x] `AGENTS.md` — engine shape, slug/spelling rule, stack summary.
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` (this file).
- [x] `doc/index.md` — reference-material index.
- [x] `doc/must-scoring-rules.md` — rule-by-rule table with predicates.
- [x] `doc/glim-criteria.md` — phenotypic / etiologic criteria and staging.
- [x] `doc/refeeding-syndrome-risk.md` — NICE CG32 criteria and monitoring.
- [x] `doc/nutrition-care-process.md` — BDA ADIME model cross-walk.
- [x] `doc/safety-case-notes.md` — DCB0129 / DCB0160 placeholders.

## Schema

- [x] `sql/00_create_extensions.sql`
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_dietitian.sql`
- [x] `sql/04_create_table_medication.sql`
- [x] `sql/05_create_table_patient_medication.sql`
- [x] `sql/06_create_table_allergy.sql`
- [x] `sql/07_create_table_patient_allergy.sql`
- [x] `sql/08_create_table_dietic_assessment.sql`
- [x] `sql/09_create_table_dietic_assessment_grade.sql`
- [x] `sql/10_create_table_dietic_assessment_grade_rule.sql`
- [x] `sql/11_create_table_dietic_assessment_grade_flag.sql`
- [x] `sql/schema.sql` (generated, combined)
- [x] `bin/test-sql-apply dietic-assessment` passes.

## Generated representations

- [x] `xml/` — XML + DTD per SQL table.
- [x] `fhir/r5/` — FHIR HL7 R5 JSON per SQL entity.
- [x] `protobuf/` — Protocol Buffers schemas.
- [x] `openapi/` — OpenAPI 3.1 specifications.
- [x] `back-end-with-loco-setup` — scaffold script.
- [x] `CHANGELOG.md` and `examples/`.
- [x] `llms.txt`.
- [x] `forms.tsv` regenerated at the repo root.

## Front-end with HTML

- [x] `index.html` — 16-step single-page wizard, Lily headless classes.
- [x] `dashboard.html` — review table with export.
- [x] `js/types.js` — assessment and grading types.
- [x] `js/must-rules.js` — MUST components, MUAC fallback, boundary handling.
- [x] `js/glim-rules.js` — GLIM phenotypic / etiologic criteria and staging.
- [x] `js/composite-grader.js` — max-grade composite risk.
- [x] `js/flagged-issues.js` — the 24 safety-flag categories.
- [x] `js/form-app.js` — wizard controller, autosave, report render.
- [x] `js/dashboard-app.js` — dashboard controller.
- [x] Header controls: locale, theme, text size, share.
- [x] `bin/es-modules-refactor --check dietic-assessment` passes.
- [x] `bin/lily-html-refactor --check dietic-assessment` passes.
- [x] `bin/test-e2e --html dietic-assessment` passes.

## Front-end with SvelteKit

- [x] Project scaffold, Tailwind 4, Lily Svelte helpers, theme catalogue.
- [x] Root welcome page at `/`.
- [x] Wizard route under `src/routes/dietic-assessment/`.
- [x] Dashboard routes `/dietic-assessments/` and `/dietic-assessments/[id]/`.
- [x] `src/lib/engine/` — the engine in TypeScript (48 Vitest cases).
- [x] Vitest boundary tests on every MUST threshold.
- [x] PDF report endpoint via `pdfmake`.
- [x] `pnpm check` and `pnpm test` pass.
- [x] Lily Svelte drift detectors pass.

## Back-end with Loco

- [x] Run `back-end-with-loco-setup` to scaffold the crate.
- [x] One migration + one entity per SQL table, relational (not JSONB).
- [x] Controllers with `serde(rename_all = "camelCase")` params.
- [x] `bin/loco-migration-defaults --check dietic-assessment` passes.
- [x] `bin/loco-migration-nullability --check dietic-assessment` passes.
- [x] `bin/loco-config-refactor --check dietic-assessment` passes.
- [x] `bin/generate-loco-deny-config.py --check dietic-assessment` passes.
- [x] `cargo build` and `cargo test` pass (33 tests).
- [ ] `cargo deny --all-features check` — fails on RUSTSEC-2023-0071 (`rsa`,
      transitive via SeaORM's MySQL driver). Fleet-wide: the canonical crate
      `forms/medical-operation-note/back-end-with-loco` fails identically.

## Verify

- [x] `bin/test-form dietic-assessment` passes.
- [x] `bin/test-examples-conformance dietic-assessment` passes.
- [x] `bin/generate-llms-txt.py --check dietic-assessment` passes.
- [x] `bin/generate-spec.py --check` passes.
