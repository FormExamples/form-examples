# Changelog — United Kingdom Birth Registration

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **United Kingdom Birth Registration** form.

## [Unreleased]

### Added
- Initial form: register a birth in England and Wales (GOV.UK "Register a
  birth") and order the birth certificate (General Register Office), as a
  completeness-and-validity engine rather than a clinical score.
- Readiness classes: `ready-to-submit`, `incomplete`,
  `needs-additional-evidence`, `out-of-scope` (a stillbirth, or a birth outside
  England and Wales).
- Rules: the 42-day statutory period (and a 35-day warning), qualified
  informants, the second-parent basis for married, unmarried, female-couple and
  male-couple parents, the signed form or court document that goes with it,
  identity evidence (one accepted document or two secondary documents, originals
  only), and the certificate order.
- SQL, generated XML / FHIR R5 / protobuf / OpenAPI, the HTML and SvelteKit
  front-ends with matching engines, the Axum crate, and 17 personas covering
  every class and every flag.
