# Tasks: Hip Replacement Surgery Evaluation

## Scaffolding

- [x] Run `bin/create-form hip-replacement-surgery-evaluation`.
- [x] Verify the directory structure matches `bin/test-form` expectations.

## Documentation

- [x] `index.md` — 15-step wizard table, OHS scoring, safety flags.
- [x] `spec/index.md` — living domain spec and acceptance criteria.
- [x] `AGENTS.md` — engine shape, "what this form is not", stack summary.
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` (this file).
- [x] `doc/index.md` — reference-material index.
- [x] `doc/ohs-scoring.md` — item table, banding convention, rule IDs.
- [x] `doc/safety-case-notes.md` — DCB0129 / DCB0160 placeholders.

## Schema

- [x] `sql/00_create_extensions.sql` (pgcrypto + pg_trgm)
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_clinician.sql`
- [x] `sql/04_create_table_hip_replacement_surgery_evaluation.sql`
- [x] `sql/05_create_table_hip_replacement_surgery_evaluation_grade.sql`
- [x] `sql/06_create_table_hip_replacement_surgery_evaluation_grade_flag.sql`
- [x] `sql/schema.sql` (generated, combined)
- [x] `bin/test-sql-apply hip-replacement-surgery-evaluation` passes.

## Generated representations

- [x] `xml/` — XML + DTD per SQL table.
- [x] `fhir/r5/` — FHIR HL7 R5 JSON per SQL entity.
- [x] `protobuf/` — Protocol Buffers schemas.
- [x] `openapi/` — OpenAPI 3.1 specifications.
- [x] `back-end-with-loco-setup` — scaffold script.
- [x] `CHANGELOG.md` and `examples/`.
- [x] `llms.txt`.
- [x] Per-directory `index.md`/`AGENTS.md`/`CLAUDE.md`/`README.md` quartet for
      `xml/`, `protobuf/`, `openapi/`, `fhir/r5/`, `sql/` (not scaffolded
      uniformly by `bin/create-form`).

## Scoring engine (SvelteKit / TypeScript)

- [x] `src/lib/engine/types.ts`
- [x] `src/lib/engine/defaults.ts`
- [x] `src/lib/engine/utils.ts`
- [x] `src/lib/engine/ohs-rules.ts`
- [x] `src/lib/engine/flagged-issues.ts`
- [x] `src/lib/engine/grader.ts` (`calculateHipEvaluation`)
- [x] `src/lib/engine/grader.test.ts` — 25/25 cases pass, every threshold
      covered on both sides.

## Front-end with SvelteKit

- [x] `src/lib/components/steps/StepNName.svelte` × 15.
- [x] Routes nested under `src/routes/hip-replacement-surgery-evaluation/`
      (welcome page, wizard at `.../hip-replacement-surgery-evaluations/[id]/`,
      dashboard at `.../hip-replacement-surgery-evaluations/`, report +
      report/pdf), mirroring `dietic-assessment`'s actual route nesting.
- [x] PDF report endpoint via `pdfmake` (`src/lib/report/pdf-builder.ts`).
- [x] Vendored `src/lib/components/ui/` and `static/themes/` from
      `dietic-assessment`.
- [x] `npx vitest run` (25/25), `svelte-check` (0 errors/0 warnings), `vite
      build` all pass in the main checkout.

## Front-end with HTML

- [x] `js/types.js`, `js/ohs-rules.js`, `js/flagged-issues.js`,
      `js/composite-grader.js` (rule/flag IDs identical to the TS engine).
- [x] `js/form-app.js`, `index.html` — 15-step single-page wizard.
- [x] `js/dashboard-app.js`, `js/dashboard-types.js`, `js/data.js`, `js/api.js`,
      `dashboard.html`.
- [x] Vendored shared JS/CSS from `dietic-assessment` (LocalStorage keys
      corrected to the `hip-replacement-surgery-evaluation.*` slug).
- [x] Standalone Node harness (`js/cross-check.mjs`) cross-checking the HTML
      engine against the Vitest cases — 49/49 pass.
- [x] `bin/lily-html-refactor --check hip-replacement-surgery-evaluation`
      passes.
- [x] `bin/es-modules-refactor --check hip-replacement-surgery-evaluation`
      passes.

## Back-end with Loco

- [x] Scaffolded `patient`, `clinician`,
      `hip_replacement_surgery_evaluation`,
      `hip_replacement_surgery_evaluation_grade`,
      `hip_replacement_surgery_evaluation_grade_flag` entities (loco-rs
      1.0.1, `i64` ids, relational per-table schema).
- [x] `cargo build --all-targets` succeeds.
- [x] `cargo test` passes (28/28) against the scratch Postgres test database.

## Verification

- [x] `bin/test-form hip-replacement-surgery-evaluation` — only fails on
      `typespec/`, intentionally left as an empty placeholder per the build
      instructions.
- [x] `bin/test-sql-apply hip-replacement-surgery-evaluation`
- [x] `bin/test-examples-conformance hip-replacement-surgery-evaluation`
- [x] `bin/lily-html-refactor --check hip-replacement-surgery-evaluation`
- [x] `bin/lily-svelte-refactor --check hip-replacement-surgery-evaluation`
- [x] `bin/generate-llms-txt.py --check hip-replacement-surgery-evaluation`
- [x] `bin/generate-spec.py --check hip-replacement-surgery-evaluation`

## Deferred / not done

- [ ] `typespec/` left empty per explicit build instructions.
- [ ] `cargo deny --all-features check` not run against the new crate's
      `deny.toml` (generator wasn't invoked for this slug in this pass).
