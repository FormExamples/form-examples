# Angiography Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the per-form /
per-subdirectory documentation are in place. Generated derivatives (XML, FHIR
R5, protobuf, OpenAPI, Loco setup, examples, spec, changelog), front-end apps,
and the Loco back-end crate are the remaining depth work.

## Why this form exists

Imaging and vascular departments triage incoming angiography requests by
clinical acuity, appropriateness, and contrast / radiation safety, but referral
quality varies — the indication, specific clinical question, and renal function
are the most commonly omitted, highest-value fields. This form makes the request
structured and gradeable so vetting is consistent, auditable, and aligned with
ACR / RCR iRefer / ESUR / IR(ME)R guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, contrast / radiation safety,
  completeness, and triage are independent and each citable to a recognized
  body. A request can be appropriate yet contraindicated for contrast, or
  complete yet urgent.
- **Safety auto-escalates.** eGFR < 30 with iodinated contrast, severe contrast
  allergy, active bleeding on anticoagulation, or pregnancy with ionizing
  radiation drive the safety band to `contraindicated` and fire high-priority
  flags regardless of the other axes.
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

- ACR appropriateness lookup table per (indication × modality × region).
- ESUR contrast-safety decision table keyed on eGFR bands and contrast type.
- Curated low-risk / urgent / contraindicated example fixtures.
