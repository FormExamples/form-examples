# Changelog Ã¢ÂÂ Pre-operative Assessment by Clinician

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **Pre-operative Assessment by Clinician** form.

## [Unreleased]

### Added
- Accessible-UX toolbar (`front-end-with-html/js/a11y.js`): comfortable-reading mode, text-size, read-aloud, start-over.
- Patientâclinician handoff consumer (`front-end-with-html/js/linkage.js`): when opened from the patient self-report form it pre-fills patient identity + anthropometrics and shows a patient-reported banner to verify against objective findings.
- GLP-1 receptor agonist perioperative management (step 13): fasting/hold
  strategy, GI symptom screening, gastric ultrasound, full-stomach
  precautions -- 12 new `glp1_*` columns and the `glp1-aspiration-risk`
  safety flag.
- Expanded frailty assessment (step 14): Fried Frailty Phenotype (5
  criteria, computed 0-5 score + robust/pre-frail/frail category), Risk
  Analysis Index, Mini-Cog cognitive screen (indicated at CFS >= 5), and a
  prehabilitation plan -- 12 new frailty-extension columns plus
  `fried_phenotype_score`/`fried_frailty_category` on the grade table.
- Frailty x GLP-1 intersecting-risk safety flags: `cognitive-assessment-indicated`,
  `sarcopenia-risk`, `dehydration-aki-risk`, `rebound-glycaemic-risk`.
- New reference doc [`doc/glp1-frailty-perioperative-management.md`](doc/glp1-frailty-perioperative-management.md).
- _Pending -- record further new fields, fired-rule categories, schema
  columns, front-end steps, clinical references, and examples._

### Changed
- Linked the patient counterpart in `index.md`; corrected stale directory/architecture references in `AGENTS.md` (dedup consolidated dirs, `xml/`→`xml/`, `fhir/r5/`→`fhir/r5/`, HTMX→JSON API).
- Renamed the HTML front-end localStorage key to the canonical `pre-operative-assessment-by-clinician.front-end-with-html.v1`.
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
