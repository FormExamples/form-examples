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

- [x] `sql/00_create_extensions.sql`
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_clinician.sql`
- [x] `sql/04_create_table_hip_replacement_surgery_evaluation.sql`
- [x] `sql/05_create_table_hip_replacement_surgery_evaluation_grade.sql`
- [x] `sql/06_create_table_hip_replacement_surgery_evaluation_grade_flag.sql`
- [x] `sql/schema.sql` (generated, combined)
- [ ] `bin/test-sql-apply hip-replacement-surgery-evaluation` passes (pending scratch-Postgres run).

## Generated representations

- [x] `xml/` — XML + DTD per SQL table.
- [x] `fhir/r5/` — FHIR HL7 R5 JSON per SQL entity.
- [x] `protobuf/` — Protocol Buffers schemas.
- [x] `openapi/` — OpenAPI 3.1 specifications.
- [x] `back-end-with-loco-setup` — scaffold script.
- [x] `CHANGELOG.md` and `examples/`.
- [x] `llms.txt`.

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

- [ ] `src/lib/components/steps/StepNName.svelte` × 15.
- [ ] `src/routes/hip-replacement-surgery-evaluation/` wizard route.
- [ ] `src/routes/hip-replacement-surgery-evaluations/` dashboard list route.
- [ ] `src/routes/hip-replacement-surgery-evaluations/[id]/` detail route.
- [ ] PDF report endpoint via `pdfmake`.
- [ ] Vendored `src/lib/components/ui/` and `static/themes/` from
      `dietic-assessment`.
- [ ] `pnpm check` and `pnpm test` pass.

## Front-end with HTML

- [ ] `js/types.js`, `js/ohs-rules.js`, `js/flagged-issues.js`,
      `js/composite-grader.js` (rule/flag IDs identical to the TS engine).
- [ ] `js/form-app.js`, `index.html` — 15-step single-page wizard.
- [ ] `js/dashboard-app.js`, `js/dashboard-types.js`, `js/data.js`,
      `dashboard.html`.
- [ ] Vendored shared JS/CSS from `dietic-assessment`.
- [ ] Standalone Node harness cross-checking the HTML engine against the
      Vitest cases.
- [ ] `bin/lily-html-refactor --check hip-replacement-surgery-evaluation`
      passes.

## Back-end with Loco

- [ ] Scaffold `patient`, `clinician`,
      `hip_replacement_surgery_evaluation`,
      `hip_replacement_surgery_evaluation_grade`,
      `hip_replacement_surgery_evaluation_grade_flag` entities.
- [ ] `cargo build` succeeds.
- [ ] `cargo test` passes against the scratch Postgres test database.

## Verification

- [ ] `bin/test-form hip-replacement-surgery-evaluation`
- [ ] `bin/test-sql-apply hip-replacement-surgery-evaluation`
- [ ] `bin/test-examples-conformance hip-replacement-surgery-evaluation`
- [ ] `bin/lily-html-refactor --check hip-replacement-surgery-evaluation`
- [ ] `bin/lily-svelte-refactor --check hip-replacement-surgery-evaluation`
- [ ] `bin/generate-llms-txt.py --check hip-replacement-surgery-evaluation`
- [ ] `bin/generate-spec.py --check hip-replacement-surgery-evaluation`
