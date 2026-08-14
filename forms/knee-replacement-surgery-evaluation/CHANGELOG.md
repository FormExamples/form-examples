# Changelog — Knee Replacement Surgery Evaluation

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **Knee Replacement Surgery Evaluation** form.

## [Unreleased]

### Added
- Initial build of the form: 15-step single-page wizard for an orthopaedic
  knee-replacement surgery evaluation.
- SQL schema (`sql/02`–`06`): `patient`, `clinician`,
  `knee_replacement_surgery_evaluation`, `knee_replacement_surgery_evaluation_grade`,
  `knee_replacement_surgery_evaluation_grade_flag`.
- Pure TypeScript scoring engine (`calculateKneeEvaluation()`): the 12-item
  Oxford Knee Score (Dawson et al. 1998), the operational OKS category bands
  (severe/moderate/mild-to-moderate/satisfactory), Kellgren-Lawrence
  radiographic grading per compartment (Kellgren & Lawrence 1957), and a
  five-rule, first-match-wins surgical-candidacy recommendation
  (strong-candidate / candidate / continue-conservative / not-indicated /
  mdt-review).
- Six independent safety flags: `conservative-treatment-not-exhausted`,
  `high-bmi-surgical-risk`, `pre-op-bloods-incomplete`,
  `fixed-flexion-deformity`, `bilateral-symptomatic`, `paediatric`.
- Clinician override of the computed candidacy, with a mandatory reason when
  it differs from the computed value.
- Generated XML, FHIR R5, Protocol Buffers, and OpenAPI representations per
  SQL table.
- Front-end with HTML (Lily Design System, ES modules) and front-end with
  SvelteKit, both single-page wizard + review dashboard.
- Rust/axum/Loco JSON-API back-end, relational per-table schema.

### Changed
- _Pending — record schema migrations, scoring-engine behaviour changes,
  re-banding of composite risk, front-end UX changes, breaking renames._

### Deprecated
- _Pending._

### Removed
- _Pending._

### Fixed
- _Pending — record corrections to scoring rules, schema fixes, front-end
  regressions, FHIR mapping fixes._

### Security
- _Pending — record fixes affecting PHI handling, audit logging, or access
  control._

## Versioning policy

- **MAJOR** — incompatible schema or scoring change (renamed columns,
  re-banded grades, reshaped FHIR Bundle).
- **MINOR** — backwards-compatible additions (new optional fields, new fired
  rules that only add flags, new examples).
- **PATCH** — fixes that do not change the public contract (UI bugs, doc
  corrections, regenerated derived artefacts).

## See also

- [`spec.md`](spec.md) — living domain spec.
- [`plan.md`](plan.md) — development roadmap.
- [`tasks.md`](tasks.md) — open and completed tasks.
- [`examples/`](examples/) — filled-form JSON fixtures and FHIR Bundle samples
  used as referenced material for changelog entries.
