# Changelog — Health Screening Questionnaire

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **Health Screening Questionnaire** form.

## [Unreleased]

### Added
- Initial form: a generic, purpose-flexible health and lifestyle screen across a 14-step
  single-page wizard, wrapping PAR-Q+ (physical-activity readiness, 7-item general health
  screen) and AUDIT-C (3-item alcohol screen) inside assessment context, personal details,
  lifestyle, medical/family history, a symptom review, optional vital signs, conditional
  occupational factors, a light-touch wellbeing check, vaccination status, and consent.
- Scoring engine: PAR-Q+ clearance (`cleared` / `further-assessment-required`) and AUDIT-C
  score/band (sex-adjusted at-risk threshold 5 men / 4 women, higher-risk threshold 8), composed
  into a composite risk band (Low / Moderate / High / Refer urgently) by a max-grade algorithm.
- Eight safety-flag categories that fire independently of the risk band and are never suppressed
  by an assessor override, including `urgent-cardiac-symptom` (unexplained chest pain or fainting,
  forcing `refer-urgently`) and `paediatric` (age < 16, routed to a paediatric pathway instead of
  being scored).
- Deliberate PAR-Q+ scope simplification, documented in `spec/index.md` §2: a single
  `further-assessment-required` follow-up state rather than PAR-Q+'s full condition-specific
  supplementary questionnaires.
- `assessor`, not `clinician`, table and TypeScript section — this form's users are frequently
  non-clinical (gym instructors, personal trainers, HR officers), documented in `AGENTS.md`.
- SQL schema (`sql/02`–`sql/06`): `patient`, `assessor`, `health_screening_questionnaire`, and
  the `_grade` / `_grade_flag` result tables.
- Generated XML + DTD, FHIR R5, Protocol Buffers, and OpenAPI 3.1 representations, plus the
  Loco scaffold script, `examples/`, and `llms.txt`.
- `front-end-with-html/`: the 14-step wizard (step 10 conditional on occupational-pre-placement
  screening purpose) and a review dashboard on Lily Design System headless classes with native
  ES modules; `js/cross-check.mjs` cross-checks the vanilla-JS engine against the SvelteKit
  engine's Vitest cases.
- `front-end-with-svelte/`: the same wizard and dashboard in SvelteKit 2 / Svelte 5 runes with a
  welcome page, a `pdfmake` report endpoint, and 39 Vitest cases asserting both sides of every
  PAR-Q+ item and AUDIT-C threshold.
- `back-end-with-loco/`: Rust axum + Loco 1.0.1 JSON API, relational per-table schema, `i64` ids.
- Clinical reference documentation in `doc/`: the PAR-Q+ and AUDIT-C instrument reference with
  rule IDs, and clinical-safety case notes with a preliminary hazard list.

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
