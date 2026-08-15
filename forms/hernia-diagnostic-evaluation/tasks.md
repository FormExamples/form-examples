# Tasks: Hernia Diagnostic Evaluation

## Scaffolding

- [x] Run `bin/create-form hernia-diagnostic-evaluation`.
- [x] Verify the directory structure matches `bin/test-form` expectations.

## Documentation

- [x] `index.md` — 14-step wizard table, classification/urgency system, safety flags.
- [x] `spec/index.md` — living domain spec and acceptance criteria.
- [x] `AGENTS.md` — engine shape, urgency computation, stack summary.
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` (this file).
- [x] `doc/index.md` — reference-material index.
- [x] `doc/ehs-classification.md` — European Hernia Society classification structure.
- [x] `doc/urgency-rules.md` — red-flag-first rule-by-rule table with predicates.
- [x] `doc/safety-case-notes.md` — DCB0129 / DCB0160 placeholders and hazard list.

## Schema

- [x] `sql/00_create_extensions.sql` (added `pg_trgm`)
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_clinician.sql`
- [x] `sql/04_create_table_hernia_diagnostic_evaluation.sql`
- [x] `sql/05_create_table_hernia_diagnostic_evaluation_grade.sql`
- [x] `sql/06_create_table_hernia_diagnostic_evaluation_grade_flag.sql`
- [x] `sql/schema.sql` (generated, combined)
- [x] `bin/test-sql-apply hernia-diagnostic-evaluation` passes.

## Generated representations

- [x] `xml/` — XML + DTD per SQL table.
- [x] `fhir/r5/` — FHIR HL7 R5 JSON per SQL entity.
- [x] `protobuf/` — Protocol Buffers schemas.
- [x] `openapi/` — OpenAPI 3.1 specifications.
- [x] `back-end-with-loco-setup` — scaffold script.
- [x] `CHANGELOG.md` and `examples/`.
- [x] `llms.txt`.

## Scoring engine (engine-first)

- [x] `front-end-with-svelte/src/lib/engine/types.ts` — evaluation and grading types.
- [x] `front-end-with-svelte/src/lib/engine/defaults.ts` — `createDefaultAssessment()`.
- [x] `front-end-with-svelte/src/lib/engine/utils.ts` — `num`, `rule`, `ageInYears`, `titleCase`.
- [x] `front-end-with-svelte/src/lib/engine/classification-rules.ts` — classification, reducibility, red-flag screen, urgency.
- [x] `front-end-with-svelte/src/lib/engine/flagged-issues.ts` — the safety-flag categories.
- [x] `front-end-with-svelte/src/lib/engine/grader.ts` — `calculateHerniaEvaluation()` entry point.
- [x] `front-end-with-svelte/src/lib/engine/grader.test.ts` — 35 Vitest boundary cases, all pass.

## Front-end with HTML

- [x] `index.html` — 14-step single-page wizard, Lily headless classes.
- [x] `dashboard.html` — review table with export.
- [x] `js/types.js`, `js/utils.js` — assessment and grading types.
- [x] `js/classification-rules.js` — classification, reducibility, red-flag, urgency port.
- [x] `js/composite-grader.js` — red-flag-first urgency composition.
- [x] `js/flagged-issues.js` — the safety-flag categories.
- [x] `js/form-app.js` — wizard controller, autosave, report render.
- [x] `js/dashboard-app.js` — dashboard controller.
- [x] Header controls: locale, theme, text size, share (vendored).
- [x] Standalone Node parity check against the TypeScript engine's boundary cases.
- [x] `bin/es-modules-refactor --check hernia-diagnostic-evaluation` passes.
- [x] `bin/lily-html-refactor --check hernia-diagnostic-evaluation` passes.

## Front-end with SvelteKit

- [x] Project scaffold, Tailwind 4, Lily Svelte helpers, theme catalogue (vendored).
- [x] Root welcome page at `/`.
- [x] Wizard route under `src/routes/hernia-diagnostic-evaluation/`.
- [x] Dashboard routes `/hernia-diagnostic-evaluations/` and `/hernia-diagnostic-evaluations/[id]/`.
- [x] PDF report endpoint via `pdfmake`.
- [x] `pnpm check` and `pnpm test` pass.
- [x] `bin/lily-svelte-refactor --check hernia-diagnostic-evaluation` passes.

## Back-end with Loco

- [x] Run `back-end-with-loco-setup` to scaffold the crate.
- [x] One migration + one entity per SQL table, relational (not JSONB).
- [x] Controllers with `serde(rename_all = "camelCase")` params.
- [x] `bin/loco-migration-defaults --check hernia-diagnostic-evaluation` passes.
- [x] `bin/loco-migration-nullability --check hernia-diagnostic-evaluation` passes.
- [x] `bin/loco-config-refactor --check hernia-diagnostic-evaluation` passes.
- [x] `bin/generate-loco-deny-config.py hernia-diagnostic-evaluation` run.
- [x] `cargo build` and `cargo test` pass.

## Verify

- [x] `bin/test-sql-apply hernia-diagnostic-evaluation` passes.
- [x] `bin/test-examples-conformance hernia-diagnostic-evaluation` passes.
- [x] `bin/test-form hernia-diagnostic-evaluation` passes.
- [x] `bin/generate-llms-txt.py --check hernia-diagnostic-evaluation` passes.
- [x] `bin/generate-spec.py --check hernia-diagnostic-evaluation` passes.
