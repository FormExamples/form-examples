# Genetic Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the form's AI
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), front-end apps, and the Loco
back-end crate are the remaining depth work.

## Why this form exists

Genomic Laboratory Hubs triage incoming genomic test requests for eligibility
against the NHS National Genomic Test Directory, but referral quality varies —
the indication, clinical details / phenotype, and family history are the most
commonly omitted, highest-value fields, and documented consent / pre-test
counselling is frequently missing for predictive testing. This form makes the
request structured and gradeable so vetting is consistent, auditable, and aligned
with the Test Directory eligibility criteria and ACGS consent guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, consent & counselling, completeness,
  and triage are independent and each citable to a recognised body. A request can
  be eligible yet lack documented consent, or complete yet urgent.
- **Consent is mandatory-blocking for predictive testing.** A predictive /
  presymptomatic request with no consent or pre-test counselling is `not-met` and
  fires a blocking flag regardless of the other axes.
- **Pure scoring engine.** Deterministic function with stable rule IDs shared
  across every front-end and the back-end.
- **Schema is the source of truth.** Everything downstream is generated.
- **Single-page wizard.** One continuous form, no multi-page navigation.

## Build order

1. [x] SQL migrations (patient, clinician, request, grade, grade_rule, grade_flag)
2. [ ] Generated representations (XML, FHIR R5, protobuf, OpenAPI)
3. [ ] Loco setup script, examples, spec.md, CHANGELOG.md
4. [x] index.md / AGENTS.md / plan.md / tasks.md / doc
5. [ ] front-end-form-with-html (HTML wizard + JS four-axis engine)
6. [ ] front-end-form-with-svelte (SvelteKit wizard + TS engine)
7. [ ] front-end-dashboard-with-html / front-end-dashboard-with-svelte
8. [ ] back-end-with-loco (Rust JSON API; cargo test requires Postgres)

## Future enhancements

- Curated eligible / borderline / not-eligible example fixtures.
- Test Directory clinical-indication (CI) lookup table per (indication × test type).
- HPO-term picker for the clinical-details / phenotype field.
