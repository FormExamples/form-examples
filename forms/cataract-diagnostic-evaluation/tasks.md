# Tasks: Cataract Diagnostic Evaluation

## Scaffolding

- [x] Run `bin/create-form cataract-diagnostic-evaluation`.
- [x] Verify the directory structure matches `bin/test-form` expectations.

## Documentation

- [x] `index.md` — 15-step wizard table, LOCS III scoring, safety flags.
- [x] `spec/index.md` — living domain spec and acceptance criteria.
- [x] `AGENTS.md` — engine shape, conventions, stack summary.
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` (this file).
- [x] `doc/index.md` — reference-material index.
- [x] `doc/locs-iii-grading.md` — LOCS III reference + severity-band derivation.
- [x] `doc/safety-case-notes.md` — DCB0129 / DCB0160 placeholders.

## Schema

- [x] `sql/00_create_extensions.sql` (pgcrypto, pg_trgm)
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_clinician.sql`
- [x] `sql/04_create_table_cataract_diagnostic_evaluation.sql`
- [x] `sql/05_create_table_cataract_diagnostic_evaluation_grade.sql`
- [x] `sql/06_create_table_cataract_diagnostic_evaluation_grade_flag.sql`
- [x] `sql/schema.sql` (generated, combined)
- [x] `bin/test-sql-apply cataract-diagnostic-evaluation` passes.

## Generated representations

- [x] `xml/` — XML + DTD per SQL table.
- [x] `fhir/r5/` — FHIR HL7 R5 JSON per SQL entity.
- [x] `protobuf/` — Protocol Buffers schemas.
- [x] `openapi/` — OpenAPI 3.1 specifications.
- [x] `back-end-with-loco-setup` — scaffold script.
- [x] `CHANGELOG.md` and `examples/`.
- [x] `llms.txt`.
- [x] `bin/test-examples-conformance cataract-diagnostic-evaluation` passes.

## Scoring engine (TypeScript, engine-first)

- [x] `src/lib/engine/types.ts`
- [x] `src/lib/engine/defaults.ts`
- [x] `src/lib/engine/utils.ts`
- [x] `src/lib/engine/locs-rules.ts` — LOCS III severity + surgical candidacy
- [x] `src/lib/engine/flagged-issues.ts` — safety flags
- [x] `src/lib/engine/grader.ts` — `calculateCataractEvaluation()`
- [x] `src/lib/engine/grader.test.ts` — 40 boundary-test cases, all passing

## Front-end with HTML

- [x] `js/types.js`, `js/locs-rules.js`, `js/flagged-issues.js`,
      `js/composite-grader.js` (mirrors the TS engine exactly)
- [x] `js/form-app.js`, `index.html` — 15-step single-page wizard
- [x] `dashboard.html`, `js/dashboard-app.js`, `js/dashboard-types.js`,
      `js/data.js`
- [x] Vendored shared JS/CSS (date-time-picker, theme-select, locale-select,
      text-size-picker, share-picker, table-export, `css/themes/`)
- [x] Standalone Node test harness (`test/engine.test.mjs`) cross-checking
      the JS engine against the TS engine's Vitest cases — 40/40 pass
- [x] `bin/lily-html-refactor --check cataract-diagnostic-evaluation` passes

## Front-end with SvelteKit

- [x] Engine unit-tested (`pnpm test`, 40 cases).
- [x] Step components under `src/lib/components/steps/`
- [x] Wizard route under `src/routes/cataract-diagnostic-evaluation/`
- [x] RESTful dashboard: `cataract-diagnostic-evaluations/` list and
      `cataract-diagnostic-evaluations/[id]/` detail, nested under the form
      route per `forms/AGENTS-front-end-svelte.md`
- [x] `pdfmake` PDF report endpoint
- [x] Vendored `src/lib/components/ui/` and `static/themes/`
- [x] `pnpm check` and `pnpm test` pass; `pnpm build` succeeds
- [x] `bin/lily-svelte-refactor --check cataract-diagnostic-evaluation` passes

## Back-end with Loco

- [x] `cargo loco generate scaffold` for each of the 5 tables (relational,
      per-table, `i64` ids), then upgraded to loco-rs 1.0.1
- [x] `src/cataract_diagnostic_evaluation/` route layout
- [x] `cargo build` succeeds
- [x] `cargo test` passes against the scratch Postgres test database (28/28)

## Verification

- [x] `bin/test-form cataract-diagnostic-evaluation`
- [x] `bin/test-sql-apply cataract-diagnostic-evaluation`
- [x] `bin/test-examples-conformance cataract-diagnostic-evaluation`
- [x] `bin/lily-html-refactor --check cataract-diagnostic-evaluation`
- [x] `bin/lily-svelte-refactor --check cataract-diagnostic-evaluation`
- [x] `bin/generate-llms-txt.py --check cataract-diagnostic-evaluation`
- [x] `bin/generate-spec.py --check cataract-diagnostic-evaluation`
