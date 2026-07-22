# Changelog Ã¢ÂÂ Pre-Anaesthesia Assessment

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **Pre-Anaesthesia Assessment** form.

## [Unreleased]

### Added
- Accessible-UX toolbar (`front-end-with-html/js/a11y.js`): comfortable-reading mode, text-size, read-aloud, start-over.
- Patientâclinician handoff consumer (`front-end-with-html/js/linkage.js`): when opened from the patient self-report form it pre-fills patient identity + anthropometrics and shows a patient-reported banner to verify against objective findings.
- _Pending Ã¢ÂÂ record new fields, new fired-rule categories, new schema columns,
  new front-end steps, new clinical references, new examples, etc._

### Changed
- Linked the patient counterpart in `index.md`; corrected stale directory/architecture references in `AGENTS.md` (dedup consolidated dirs, `xml/`→`xml/`, `fhir/r5/`→`fhir/r5/`, HTMX→JSON API).
- Renamed the HTML front-end localStorage key to the canonical `pre-anaesthesia-assessment.front-end-with-html.v1`.
- _Pending Ã¢ÂÂ record schema migrations, scoring-engine behaviour changes,
  re-banding of composite risk, front-end UX changes, breaking renames._

### Deprecated
- _Pending._

### Removed
- _Pending._

### Fixed
- _Pending Ã¢ÂÂ record corrections to scoring rules, schema fixes, front-end
  regressions, FHIR mapping fixes._

### Security
- _Pending Ã¢ÂÂ record fixes affecting PHI handling, audit logging, or access
  control._

## Versioning policy

- **MAJOR** Ã¢ÂÂ incompatible schema or scoring change (renamed columns,
  re-banded grades, reshaped FHIR Bundle).
- **MINOR** Ã¢ÂÂ backwards-compatible additions (new optional fields, new fired
  rules that only add flags, new examples).
- **PATCH** Ã¢ÂÂ fixes that do not change the public contract (UI bugs, doc
  corrections, regenerated derived artefacts).

## See also

- [`spec.md`](spec.md) Ã¢ÂÂ living domain spec.
- [`plan.md`](plan.md) Ã¢ÂÂ development roadmap.
- [`tasks.md`](tasks.md) Ã¢ÂÂ open and completed tasks.
- [`examples/`](examples/) Ã¢ÂÂ filled-form JSON fixtures and FHIR Bundle samples
  used as referenced material for changelog entries.
