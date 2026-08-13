# Changelog — Dietetic Assessment

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **Dietetic Assessment** form.

## [Unreleased]

### Added
- Initial form: a dietitian-driven dietetic assessment across a 16-step single-page wizard,
  covering the five assessment domains (medical history; medication and supplements; dietary
  recall; lifestyle and food environment; physical measurements).
- Scoring engine: MUST (BAPEN) as the primary instrument, with GLIM for the malnutrition
  diagnosis and NRS-2002, SARC-F, SCOFF, and the NICE CG32 refeeding-syndrome criteria
  alongside it. Composite nutrition risk uses a max-grade algorithm.
- Twenty-three safety-flag categories that fire independently of the MUST score and are never
  suppressed by a dietitian override of the risk category.
- Mid-upper-arm-circumference fallback so a patient who declines to be weighed can still be
  scored; the result is marked estimated and the report says so.
- Oedema and amputation weight adjustments applied before body mass index is computed.
- SQL schema (`sql/02`–`sql/11`): `patient`, `dietitian`, `medication`, `patient_medication`,
  `allergy`, `patient_allergy`, `dietic_assessment`, and the `_grade` / `_grade_rule` /
  `_grade_flag` result tables.
- Generated XML + DTD, FHIR R5, Protocol Buffers, and OpenAPI 3.1 representations, plus the
  Loco scaffold script, `examples/`, and `llms.txt`.
- `front-end-with-html/`: the 16-step wizard and a review dashboard on Lily Design System
  headless classes with native ES modules; passes the Playwright smoke and axe-core
  accessibility sweep.
- `front-end-with-svelte/`: the same wizard and dashboard in SvelteKit 2 / Svelte 5 runes with
  a welcome page, a `pdfmake` report endpoint, and 48 Vitest cases asserting both sides of
  every MUST and GLIM threshold.
- Clinical reference documentation in `doc/`: MUST scoring rules, GLIM criteria, NICE CG32
  refeeding-syndrome risk, the BDA Nutrition Care Process cross-walk, and clinical-safety
  case notes with a preliminary hazard list.

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
