# Tasks: Health Screening Questionnaire

## Scaffolding

- [x] Directory scaffolded by `bin/create-form health-screening-questionnaire`.
- [x] Directory structure matches `bin/test-form` expectations.

## Documentation

- [x] `index.md` — 14-step wizard table, PAR-Q+/AUDIT-C scoring, safety flags.
- [x] `spec/index.md` — rewritten from raw research brief into living domain spec.
- [x] `AGENTS.md` — engine shape, `assessor` naming rule, stack summary.
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` (this file).
- [x] `doc/index.md` — reference-material index.
- [x] `doc/parq-plus-and-auditc.md` — PAR-Q+ 7-item + AUDIT-C 3-item tables, rule IDs.
- [x] `doc/safety-case-notes.md` — DCB0129 / DCB0160 placeholders.

## Schema

- [x] `sql/00_create_extensions.sql` (`pgcrypto`, `pg_trgm`)
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_assessor.sql`
- [x] `sql/04_create_table_health_screening_questionnaire.sql`
- [x] `sql/05_create_table_health_screening_questionnaire_grade.sql`
- [x] `sql/06_create_table_health_screening_questionnaire_grade_flag.sql`
- [x] `sql/schema.sql` (generated, combined)
- [x] `bin/test-sql-apply health-screening-questionnaire` passes.

## Generated representations

- [x] `xml/` — `bin/xml-representations/generate-xml-representations.py`
- [x] `fhir/r5/` — `bin/fhir-r5/generate-fhir-r5-representations.py`
- [x] `protobuf/` — `bin/protobuf/generate-protobuf-representations.py`
- [x] `openapi/` — `bin/openapi/generate-openapi-representations.py`
- [x] `back-end-with-loco-setup` — `bin/back-end-with-loco/generate-back-end-with-loco-setup.py`
- [x] `CHANGELOG.md` + `examples/` — `bin/generate-changelog-and-examples.py`
- [x] `llms.txt` — `bin/generate-llms-txt.py`
- [x] `bin/test-examples-conformance health-screening-questionnaire` passes.

## Engine (TypeScript, engine-first)

- [x] `front-end-with-svelte/src/lib/engine/types.ts`
- [x] `front-end-with-svelte/src/lib/engine/defaults.ts`
- [x] `front-end-with-svelte/src/lib/engine/utils.ts`
- [x] `front-end-with-svelte/src/lib/engine/parq-rules.ts`
- [x] `front-end-with-svelte/src/lib/engine/audit-c-rules.ts`
- [x] `front-end-with-svelte/src/lib/engine/flagged-issues.ts`
- [x] `front-end-with-svelte/src/lib/engine/grader.ts` — `calculateHealthScreening()`
- [x] `front-end-with-svelte/src/lib/engine/grader.test.ts` — 39 cases, every PAR-Q+ item and both AUDIT-C thresholds on both sides
- [x] `npx vitest run` green.

## Front end — SvelteKit

- [x] Vendored `src/lib/components/ui/`, `static/themes/` byte-for-byte from `dietic-assessment`.
- [x] `src/lib/config/` (steps, options, themes, locales, text-sizes).
- [x] `src/lib/stores/questionnaire.svelte.ts`.
- [x] 14 step components under `src/lib/components/steps/`, step 10 conditional on `screeningPurpose`.
- [x] Routes: welcome page, dashboard, `[id]` wizard, report, report PDF endpoint.
- [x] `src/lib/report/pdf-builder.ts`, `src/lib/data/sample-reports.ts`.
- [x] `svelte-check` — 0 errors.
- [x] `vite build` — green.

## Front end — HTML

- [x] Vendored shared JS (`date-time-picker.js`, `theme-select.js`,
      `locale-select.js`, `text-size-picker.js`, `share-picker.js`,
      `table-export.js`) and `css/themes/` byte-for-byte from `dietic-assessment`.
- [x] `js/types.js`, `js/parq-rules.js`, `js/audit-c-rules.js`,
      `js/flagged-issues.js`, `js/composite-grader.js` — line-for-line port of the TS engine.
- [x] `js/form-app.js`, `index.html` — 14-step wizard, conditional step 10.
- [x] `js/dashboard-app.js`, `js/dashboard-types.js`, `js/data.js`, `js/api.js`, `dashboard.html`.
- [x] `js/cross-check.mjs` — standalone Node harness cross-checking this engine
      against the same boundary cases as `grader.test.ts`; 35/35 pass.
- [x] `bin/lily-html-refactor --check health-screening-questionnaire` — 0 drift.
- [x] Playwright smoke test: wizard loads, step 10 conditional, validation,
      report renders, dashboard renders sample rows — 0 console errors.

## Back end — Loco

- [x] `cargo loco generate scaffold` for `patient`, `assessor`,
      `health_screening_questionnaire`, `health_screening_questionnaire_grade`,
      `health_screening_questionnaire_grade_flag` (`--api`).
- [x] `bin/route-loco-layout health-screening-questionnaire` — canonical
      `src/health_screening_questionnaire/` layout.
- [x] `bin/loco-config-refactor` — background-queue (Postgres) + observability conventions.
- [x] `bin/loco-rs-1-migration` — loco-rs 1.0.1, `i64` ids.
- [x] `bin/loco-migration-defaults` — 71 columns gained `sql/`-matching defaults.
- [x] `bin/loco-migration-nullability` — 0 drift (no nullable-unique columns).
- [x] `bin/generate-loco-deny-config.py` — `deny.toml`.
- [x] `cargo build` — green.
- [x] `cargo test` — green.

## Verify

- [ ] `bin/test-form health-screening-questionnaire`
- [x] `bin/test-sql-apply health-screening-questionnaire`
- [x] `bin/test-examples-conformance health-screening-questionnaire`
- [x] `bin/lily-html-refactor --check health-screening-questionnaire`
- [x] `bin/lily-svelte-refactor --check health-screening-questionnaire`
- [x] `bin/generate-llms-txt.py --check health-screening-questionnaire`
- [ ] `bin/generate-spec.py --check health-screening-questionnaire`

See the final report for the pass/fail status of each gate.
