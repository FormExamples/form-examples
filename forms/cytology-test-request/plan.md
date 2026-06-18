# Cytology Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the form's
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), front-end apps, and the Loco
back-end crate are the remaining depth work.

## Why this form exists

Cytology laboratories triage incoming specimen requests by clinical acuity and
appropriateness, but referral quality varies — the indication, the specific
clinical question, and the pre-analytical specimen details (collected, timing,
fixation) are the most commonly omitted, highest-value fields. This form makes
the request structured and gradeable so vetting is consistent, auditable, and
aligned with NHS Cervical Screening Programme, RCPath cytopathology, and NICE
NG12 guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, pre-analytical specimen adequacy,
  completeness, and triage are independent and each citable to a recognised
  body. A request can be appropriate yet pre-analytically poor, or complete yet
  two-week-wait urgent.
- **Suspected cancer auto-escalates.** A suspected-cancer indication or a
  previous high-grade cytology result forces two-week-wait triage regardless of
  the other axes.
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

- Curated routine / urgent / two-week-wait example fixtures.
- Appropriateness lookup table per (indication × specimen type).
- Paris-system (urine) and thyroid-Thy reporting-category integration.
