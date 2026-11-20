# Changelog — United Kingdom Marriage Certificate Application 

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **United Kingdom Marriage Certificate Application ** form.

## [Unreleased]

### Added
- New form: giving notice of marriage or civil partnership and ordering a
  marriage certificate in England and Wales. SQL (applicant, registrar,
  application, grade / rule / flag), generated XML / FHIR R5 / protobuf /
  OpenAPI, Axum crate, HTML and Svelte front-ends, spec, GOV.UK / GRO source
  notes, and seven personas covering every class and flag.
- Engine: ineligible / incomplete / needs-evidence / ready-to-submit
  classification, the permitted ceremony window (notice + 29 days to notice + 12
  months), the immigration-referral indication, and eighteen flags.
