# Pulmonary Function Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the form's AI
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), front-end apps, and the Loco
back-end crate are the remaining depth work.

## Why this form exists

Lung-function departments triage incoming spirometry and pulmonary-function
requests by clinical acuity, appropriateness, and safety, but referral quality
varies — the indication and specific clinical question are the most commonly
omitted, highest-value fields, and forced-expiration contraindications are
easily missed. This form makes the request structured and gradeable so vetting
is consistent, auditable, and aligned with ARTP / ERS-ATS standards and NICE
NG80 / NG115 guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, safety / contraindication,
  completeness, and triage are independent and each citable to a recognised
  body. A request can be appropriate yet contraindicated, or complete yet urgent.
- **Safety downgrades.** Any forced-expiration or infection-control
  contraindication downgrades the safety band and can defer the test.
- **Pure scoring engine.** Deterministic function with stable rule IDs shared
  across every front-end and the back-end.
- **Schema is the source of truth.** Everything downstream is generated.
- **Single-page wizard.** One continuous form, no multi-page navigation.

## Build order

1. [x] SQL migrations (patient, clinician, request, grade, grade_rule, grade_flag)
2. [ ] Generated representations (XML, FHIR R5, protobuf, OpenAPI)
3. [ ] Loco setup script, examples, spec.md, CHANGELOG.md
4. [x] index.md / AGENTS.md / plan.md / tasks.md / doc
5. [ ] front-end-with-html (HTML wizard + JS four-axis engine)
6. [ ] front-end-with-svelte (SvelteKit wizard + TS engine)
7. [ ] front-end-with-html / front-end-with-svelte
8. [ ] back-end-with-loco (Rust JSON API; cargo test requires Postgres)

## Future enhancements

- Curated low-risk / urgent / contraindicated example fixtures.
- Appropriateness lookup table per (indication × test type).
- Pre-test medication-withhold instructions derived from inhaler list.
