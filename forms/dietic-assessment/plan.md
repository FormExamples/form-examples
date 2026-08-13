# Plan: Dietetic Assessment

## Current status

Created 2026-08-13. Per-phase checkboxes live in [`tasks.md`](./tasks.md).

Foundation COMPLETE as of 2026-08-13. The form is full-stack.

| Layer | Status |
| --- | --- |
| Documentation (`index.md`, `spec/`, `AGENTS.md`, `doc/`) | complete |
| `sql/` migrations (source of truth) | complete — `bin/test-sql-apply` passes |
| Generated representations (XML, FHIR R5, protobuf, OpenAPI) | generated from `sql/`, all `--check` gates green |
| `examples/`, `CHANGELOG.md`, `llms.txt` | generated |
| `front-end-with-html/` | complete — Playwright smoke + axe-core a11y pass |
| `front-end-with-svelte/` | complete — `pnpm check`, 48 Vitest cases, build, all routes 200 |
| `back-end-with-loco/` | complete — loco-rs 1.0.1, `cargo build` + 33 tests pass |

`bin/test-form dietic-assessment` passes.

## Why this form exists

Nutrition is assessed by a registered dietitian across five domains that no
single-instrument calculator captures: medical history, medication and
supplements, dietary recall, lifestyle and food environment, and physical
measurements. Screening tools such as MUST are quick but shallow; a full
dietetic assessment is the record that turns a screening score into a nutrition
diagnosis and a care plan. This form is that record — the document a dietitian
signs and files, and the one a ward team, GP, or care home reads.

It also handles a fact that most nutrition software ignores: **being weighed
distresses some patients**. The form treats a declined weight as a first-class
answer, estimates the MUST BMI component from mid-upper-arm circumference, and
marks the score as estimated rather than refusing to score.

## Design principles

- **Validated instruments only.** MUST is primary because it is the BAPEN
  standard in UK practice. GLIM, NRS-2002, SARC-F, and the NICE CG32 refeeding
  criteria are secondary. Nothing is invented.
- **Max-grade composite scoring.** The worst finding sets the composite risk
  band; safety flags fire independently so a critical single finding cannot be
  averaged away.
- **Dietitian override is first-class.** Computed and final risk categories are
  both stored and printed, with a mandatory reason when they differ.
- **Single-page wizard.** 16 steps on one continuous page — the monorepo rule.
- **Dignity by default.** Declined weight, interpreter required, cultural and
  religious dietary requirements, and food insecurity are ordinary fields, not
  edge cases.
- **Pure scoring engine.** `calculateNutritionRisk()` is a pure function with
  boundary tests on every MUST threshold.
- **FHIR-first exchange.** The FHIR R5 Bundle is canonical; XML is archival.
- **Spec-driven.** `spec/index.md` is updated *before* code, and derived
  artefacts are regenerated after any schema change.

## Build order

### Phase 1 — Documentation and spec

Author `index.md` (16-step wizard table, scoring, flags), `spec/index.md`
(the contract), `AGENTS.md` (engine shape and conventions), `plan.md`,
`tasks.md`, and the `doc/` clinical references. Nothing downstream is written
until the wizard's step and field list is settled here, because the SQL column
list is derived from it.

Acceptance: every instrument named in `index.md` has a citation in `doc/`, and
every step in the wizard table maps to a named group of SQL columns.

### Phase 2 — Schema

Author `sql/02`–`sql/11`. The `dietic_assessment` table holds the wizard
payload; `patient`, `dietitian`, `medication`, `patient_medication`, `allergy`,
and `patient_allergy` are the shared relational entities;
`dietic_assessment_grade` plus its `_rule` and `_flag` children hold the engine
output and its audit trail.

Every enum column is a `VARCHAR` with a `CHECK` constraint that includes `''`,
per the unanswered-value convention. Every table carries `id`, `created_at`,
`updated_at`, `deleted_at` and an `updated_at` trigger.

Acceptance: `bin/test-sql-apply dietic-assessment` applies all migrations in
order to a fresh scratch database.

### Phase 3 — Generated representations

Run, in order: the XML/DTD, FHIR R5, protobuf, and OpenAPI generators, then the
SQL comment and combined-schema generators, then the Loco setup-script,
CHANGELOG/examples, `llms.txt`, and `forms.tsv` generators.

Acceptance: each generator's `--check` mode reports no drift, and
`bin/test-examples-conformance dietic-assessment` passes.

### Phase 4 — HTML front-end

`front-end-with-html/index.html` — the 16-step single-page wizard — plus
`dashboard.html` for review. Lily Design System headless classes, native ES
modules, the four header controls (locale, theme, text size, share), and the
scoring engine in `js/`. LocalStorage draft key
`dietic-assessment.front-end-with-html.v1`.

Acceptance: `bin/lily-html-refactor --check dietic-assessment`,
`bin/es-modules-refactor --check dietic-assessment`, and
`bin/test-e2e --html dietic-assessment` all pass.

### Phase 5 — SvelteKit front-end

The same wizard and dashboard in SvelteKit 2 / Svelte 5 runes, routes nested
under `src/routes/dietic-assessment/`, RESTful dashboard at
`/dietic-assessments/` and `/dietic-assessments/[id]/`, a root welcome page,
a `pdfmake` PDF report endpoint, and Vitest unit tests for the engine.

Acceptance: `pnpm check`, `pnpm test`, and the Lily Svelte drift detectors pass.

### Phase 6 — Loco back-end

Rust, Loco 1.0.1 on axum 0.8 with SeaORM and PostgreSQL. JSON
API only. Relational per-table schema: one migration and one entity per SQL
table, `i64` ids, `serde(rename_all = "camelCase")`. Run the `bin/loco-*`
tools afterwards so column defaults, nullability, deny policy, and the
background-queue/observability config match the fleet conventions.

Acceptance: `cargo build`, `cargo test`, and every `bin/loco-* --check` pass.
`cargo deny --all-features check` reports RUSTSEC-2023-0071 (`rsa`, reached
transitively through SeaORM's MySQL driver); this is fleet-wide, and the
canonical crate `forms/medical-operation-note/back-end-with-loco` fails
identically.

## Risks and open questions

- **MUST licensing.** MUST is free to use for non-commercial purposes with
  attribution to BAPEN. The `doc/` notes record the attribution requirement;
  confirm before any commercial distribution.
- **Regulatory classification.** A tool that computes a validated screening
  score and drives a care plan may fall in Class IIa under EU MDR Rule 11. The
  form is positioned as decision support with a mandatory dietitian sign-off;
  `doc/safety-case-notes.md` holds the DCB0129 / DCB0160 placeholders.
- **Energy and protein requirement equations.** The form records estimated
  requirements as dietitian-entered numbers with the equation named
  (Henry, Schofield, or a kcal/kg rule of thumb) rather than computing them, so
  local policy governs the choice.
- **Paediatrics.** Deliberately out of scope; the `paediatric` flag redirects.
  A sibling paediatric form would need STAMP or PYMS instead of MUST.
