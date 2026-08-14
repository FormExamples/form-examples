# Tasks: Knee Replacement Surgery Evaluation

## Scaffolding

- [x] Run `bin/create-form knee-replacement-surgery-evaluation`.
- [x] Verify the directory structure matches `bin/test-form` expectations.

## Documentation

- [x] `index.md` — 15-step wizard table, OKS/candidacy scoring, safety flags.
- [x] `spec/index.md` — rewritten from the raw research brief into the
      repo's living-spec format; "what this form is not" contrast with the
      ASA-grading pre-op forms.
- [x] `AGENTS.md` — engine shape, conventions, stack summary.
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` (this file).
- [x] `doc/index.md` — reference-material index.
- [x] `doc/oks-scoring.md` — item-by-item table, category bands, candidacy
      rule order.
- [x] `doc/safety-case-notes.md` — DCB0129 / DCB0160 placeholders.

## Schema

- [x] `sql/00_create_extensions.sql` (pgcrypto + pg_trgm).
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_clinician.sql`
- [x] `sql/04_create_table_knee_replacement_surgery_evaluation.sql`
- [x] `sql/05_create_table_knee_replacement_surgery_evaluation_grade.sql`
- [x] `sql/06_create_table_knee_replacement_surgery_evaluation_grade_flag.sql`
- [x] `sql/schema.sql` (generated, combined)
- [x] `bin/test-sql-apply knee-replacement-surgery-evaluation` passes.

## Generated representations

- [x] `xml/` — XML + DTD per SQL table.
- [x] `fhir/r5/` — FHIR HL7 R5 JSON per SQL entity.
- [x] `protobuf/` — Protocol Buffers schemas.
- [x] `openapi/` — OpenAPI 3.1 specifications.
- [x] `back-end-with-loco-setup` — scaffold script.
- [x] `CHANGELOG.md` and `examples/`.
- [x] `llms.txt`.
- [x] `bin/test-examples-conformance knee-replacement-surgery-evaluation` passes.

## Scoring engine (`front-end-with-svelte/src/lib/engine/`)

- [x] `types.ts` — `KneeReplacementSurgeryEvaluation`, `GradingResult`, and
      every section type.
- [x] `defaults.ts` — `createDefaultEvaluation()`.
- [x] `utils.ts` — `num`, `round1`, `rule`, `ageInYears`, `computeBmi`.
- [x] `oks-rules.ts` — `scoreOks`, `oksCategory`, `maxKellgrenLawrenceGrade`,
      `scoreCandidacy`.
- [x] `flagged-issues.ts` — `detectFlags`, the 6 safety-flag categories.
- [x] `grader.ts` — `calculateKneeEvaluation()` entry point.
- [x] `grader.test.ts` — 40 boundary-tested Vitest cases, all green.

## Front-end with SvelteKit

- [ ] 15 `StepNName.svelte` components under `src/lib/components/steps/`.
- [ ] Wizard route `src/routes/knee-replacement-surgery-evaluation/`.
- [ ] RESTful dashboard routes
      `src/routes/knee-replacement-surgery-evaluations/` and `[id]/`.
- [ ] Root welcome page.
- [ ] Vendored `src/lib/components/ui/` and `static/themes/`.
- [ ] `pdfmake` PDF report.
- [ ] `pnpm install && npx vitest run` green; `npm run check` clean.
- [ ] `bin/lily-svelte-refactor --check knee-replacement-surgery-evaluation`
      passes.

## Front-end with HTML

- [ ] `index.html` — 15-step single-page wizard, Lily headless classes.
- [ ] `dashboard.html` — review table with export.
- [ ] `js/types.js`, `js/oks-rules.js`, `js/flagged-issues.js`,
      `js/composite-grader.js` — plain-JS port of the TypeScript engine,
      identical rule/flag IDs.
- [ ] `js/form-app.js`, `js/dashboard-app.js`, `js/dashboard-types.js`,
      `js/data.js`.
- [ ] Vendored shared JS (`date-time-picker.js`, theme/locale/text-size/share
      pickers, `table-export.js`) and `css/themes/`.
- [ ] Standalone Node cross-check harness against the TypeScript engine's
      boundary cases.
- [ ] `bin/lily-html-refactor --check knee-replacement-surgery-evaluation`
      and `bin/es-modules-refactor --check knee-replacement-surgery-evaluation`
      pass.

## Back-end with Loco

- [ ] `cargo loco generate scaffold --api` per table, per
      `back-end-with-loco-setup`.
- [ ] Migrations/entities corrected for `i64` ids, nullability, and defaults
      to match `sql/`.
- [ ] `src/knee_replacement_surgery_evaluation/` crate-source layout.
- [ ] `serde(rename_all = "camelCase")` matching the TypeScript engine's
      field names.
- [ ] `cargo build` succeeds.
- [ ] `cargo test` passes against a scratch Postgres test database.
- [ ] `bin/loco-config-refactor`, `bin/generate-loco-deny-config.py`,
      `bin/loco-migration-defaults`, `bin/loco-migration-nullability` clean.
- [ ] `cargo deny --all-features check` passes.

## Final verification

- [ ] `bin/test-form knee-replacement-surgery-evaluation`
- [ ] `bin/test-sql-apply knee-replacement-surgery-evaluation`
- [ ] `bin/test-examples-conformance knee-replacement-surgery-evaluation`
- [ ] `bin/lily-html-refactor --check knee-replacement-surgery-evaluation`
- [ ] `bin/lily-svelte-refactor --check knee-replacement-surgery-evaluation`
- [ ] `bin/generate-llms-txt.py --check knee-replacement-surgery-evaluation`
- [ ] `bin/generate-spec.py --check knee-replacement-surgery-evaluation`
