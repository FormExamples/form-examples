# Tasks

## Authored

- [x] Original design seed in `seed.md`
- [x] Design spec in `index.md` derived from `seed.md`
- [x] Agent instructions in `AGENTS.md`
- [x] Implementation plan in `plan.md`

## Schema and representations

- [x] SQL migrations (8 files): extensions, trigger function, organization,
      respondent, agile_consulting_scorecard_for_hiring_help, grade, grade_rule,
      grade_flag. Liquibase-style PostgreSQL 18 with `COMMENT ON` for every
      table and column
- [x] Generated XML + DTD per SQL table via
      `bin/xml-representations/generate-xml-representations.py`
- [x] Generated FHIR HL7 R5 JSON per SQL entity via
      `bin/fhir-r5/generate-fhir-r5-representations.py`
- [x] Golden-file fixtures in `samples/` (`sample-assessment.json`,
      `sample-grade.json`) used by engine-parity tests on both the
      TypeScript and Rust sides

## Scoring engine

- [x] `types.ts` for `AgileConsultingScorecardAssessment`
- [x] `manifesto-rules.ts` (items 1–4) + `principles-rules.ts` (items 5–16)
- [x] `score-grader.ts` with the band table (0–4 Low, 5 Borderline,
      6–10 Medium, 11–16 High)
- [x] `flagged-issues.ts` for the six readiness flags
- [x] `schema.ts` — zod runtime validation with `parseAssessment` and
      `safeParseAssessment`
- [x] Vitest unit tests: 21 score-grader cases (incl. boundary 0/4/5/6/10/11/16),
      1 parity case against the golden grade, 4 schema rejection cases,
      and 7 pdf-builder structural cases — **33 tests total**

## Front-end (SvelteKit form)

- [x] Six-step single-page wizard
      (`Step1Organization` → `Step6ScoreAndSignoff`)
- [x] Class-based reactive store (`assessment.svelte.ts`) with
      `$state` data, `$derived` grade, `currentStep` navigation
- [x] Reusable components: `ChecklistItem`, `ProgressBar`, `StepNavigation`
- [x] `/report` page rendering the grade plus a "Download PDF" button
- [x] `/report/pdf` `+server.ts` POST endpoint via `pdfmake`
      (validates input via `parseAssessment`, builds the doc via
      `buildPdfDocument`, streams the PDF)
- [x] Tailwind 4 with `@theme` band-colour tokens; production build clean

## Front-end (SvelteKit dashboard)

- [x] SVAR DataGrid (Willow theme) with 11 columns and dropdown filters
      (band / sector / size) + free-text search
- [x] Same-origin SvelteKit endpoints
      (`/api/dashboard/scorecards`, `/api/scorecards/[id]`) so the
      dashboard works standalone without a backend
- [x] `/report/[id]` route with score breakdown, band badge, flag list,
      and a "fetch from backend" pointer for item-level answers
- [x] Vitest tests: 5 `recommendation` cases, 8 `data.ts` invariants —
      **13 tests total**

## Front-end (static HTML)

- [x] Self-contained `front-end-with-html/index.html` — 6-step
      wizard with sticky live preview, JSON export
- [x] Self-contained `front-end-with-html/report.html` — printable
      readiness report (file input / paste JSON / sample loader,
      `@media print` stylesheet)
- [x] Self-contained `front-end-with-html/index.html` —
      sortable / filterable 11-column table with 12 inline samples

## Rust backend

- [x] Pure scoring engine in `src/scoring/`
      (`types.rs`, `utils.rs`, `manifesto.rs`, `principles.rs`,
      `flags.rs`, `grader.rs`) — port of the TypeScript engine
- [x] CLI binary `agile-consulting-scorecard-cli` (stdin JSON → stdout
      grade JSON)
- [x] Minimal axum HTTP server (`agile-consulting-scorecard-server`)
      with `GET /api/dashboard/scorecards`, `GET /api/scorecards/{id}`,
      and `POST /api/grade`. Same wire shape as the SvelteKit endpoints
- [x] Cargo tests: 8 grader cases (incl. golden-sample parity), 6 axum
      integration cases via `tower::ServiceExt::oneshot` —
      **14 tests total**
- [x] `templates/base.html.tera` with HTMX 2.0.8 + Alpine.js 3.14.8
- [x] `back-end-with-loco-setup` scaffold-generator
      shell script ready to run
- [ ] Run the scaffold-generator to produce SeaORM entities and Loco
      controllers — replaces the thin axum server with the full Loco app
- [ ] Tera templates: `assessment.html.tera`, `report.html.tera`,
      `dashboard.html.tera` (HTMX filter / sort / search)
- [ ] Loco-level integration tests for the assessment, grade, and
      dashboard controllers

## Adapters

- [ ] Pre-tender vendor-facing summary export (band + flags + focus
      areas only, no raw answers)
- [ ] CSV import of historical scorecards
- [ ] Slack and email outbound notifications on flag fires
- [ ] Diff endpoint for comparing two snapshots from the same
      organization

## Compliance

- [ ] ISO 9001:2015 alignment review
- [ ] UK GDPR data-processing impact assessment
- [ ] WCAG 2.2 AA accessibility audit
- [ ] Penetration testing of the full-stack deployment

## Test tally

- TypeScript (form-with-svelte): **33** Vitest cases
- TypeScript (dashboard-with-svelte): **13** Vitest cases
- Rust: **14** Cargo cases
- **Total: 60 passing tests** across the form
- `bin/test-form agile-consulting-scorecard-for-hiring-help` reports
  zero errors

## Known issues

- The seed's score band leaves `5` outside both Low (0–4) and Medium
  (6–10). The engine treats `5 → borderline` (presented as Low with an
  explanatory note) so every total in 0..16 has a defined verdict.
- This form is non-clinical, but the FHIR mapping reuses
  `ClinicalImpression` and `DetectedIssue` per monorepo convention.
  A second mapping (FHIR `QuestionnaireResponse` + `Organization`) may
  be more semantically appropriate and will be evaluated separately.
- `seed.md` does not weight manifesto items vs. principles. The engine
  reports both subtotals so a future weighting model can be layered on
  without re-modelling.
- The seed phrases each item as a behaviour ("Launch hello world to
  production"). Wizard copy converts each into a yes/no question with
  an evidence prompt while preserving the seed's nuance.
