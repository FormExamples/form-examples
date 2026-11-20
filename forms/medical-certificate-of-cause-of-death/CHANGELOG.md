# Changelog — Medical Certificate of Cause of Death (MCCD)

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **Medical Certificate of Cause of Death (MCCD)** form.

## [Unreleased]

### Added
- Statutory fields from the GOV.UK MCCD guidance for England and Wales:
  certifier qualifications and attendance mode (in person / video / telephone /
  none; no 28-day rule), ethnicity, pregnancy status, hazardous implantable
  devices, a fourth Part I line (I(d)), the coroner reasons neglect, self-harm
  and poisoning, and whether the medical examiner discussed the cause with the
  bereaved. SQL columns, the Axum crate and both front-ends carry them.
- Flags: certifier did not attend, trauma or complication in the cause,
  prohibited abbreviation, unspecified diabetes or malignancy, implantable
  device not recorded or present, ethnicity and pregnancy status not recorded.
- Five new personas covering the above (8 in total).
- Report shows the statutory additions and the medical-examiner-to-registrar
  next steps (5 days to register).

### Changed
- A telephone-only or non-attending certifier, or trauma / poisoning / surgical
  wording in any cause line, now classifies the certificate as
  refer-to-coroner (previously only the referral answers did).
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
