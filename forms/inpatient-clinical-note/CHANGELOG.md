# Changelog — Inpatient Clinical Note

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **Inpatient Clinical Note** form.

## [Unreleased]

### Added
- Server-side grading. `POST /api/inpatient_clinical_notes/{id}/grade` runs both
  engines over a stored note and persists the result as one
  `inpatient_clinical_note_grade` row plus its rule and flag children, in a
  single transaction; `GET` on the same path returns the most recent grading.
  Grading is append-only, so a note's grading history stays auditable.
- `grading` module: the projection from the relational schema onto the engine's
  input shape. Soft-deleted child rows are excluded.
- `as_str()` on `NoteType`, `CompletenessStatus`, `AcuityBand`, `ComponentKey`,
  and `FlagPriority`, plus `from_wire()` where a string is parsed back. A test
  asserts these agree with the `serde` representation for every variant.

### Changed
- _Pending — record schema migrations, scoring-engine behaviour changes,
  re-banding of composite risk, front-end UX changes, breaking renames._

### Deprecated
- _Pending._

### Removed
- _Pending._

### Fixed
- The Rust engine emitted fired-rule `component` values in the Rust `Debug`
  spelling (`IntervalHistory`) rather than the kebab-case vocabulary
  (`interval-history`) used by both front-end engines and required by the
  `component` CHECK constraint on `inpatient_clinical_note_grade_rule`. Any
  attempt to persist a grade would have been rejected by the database. The same
  `Debug` spelling leaked into four rule and flag description strings, which
  therefore read `entry Complete` and `The acuity band is Escalate` where the
  front-ends read `entry complete` and `the acuity band is escalate`.

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
