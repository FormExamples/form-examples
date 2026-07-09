# Biopsy Test Request — plan

## Current status

Scaffolded and brought to foundation depth: SQL schema (source of truth) and the
form's documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the Loco
back-end crate are the remaining depth work.

## Why this form exists

Pathology and interventional departments triage incoming biopsy requests by
clinical acuity, appropriateness, and bleeding risk, but referral quality varies
— the indication and specific clinical question are the most commonly omitted,
highest-value fields, and periprocedural anticoagulation is frequently
unaddressed. This form makes the request structured and gradeable so vetting is
consistent, auditable, and aligned with ACR / RCR–RCPath / BSG–ESGE / NICE NG12
guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, bleeding risk, completeness, and
  urgency / cancer pathway are independent and each citable to a recognised body.
  A request can be appropriate yet high bleeding-risk, or complete yet urgent.
- **Cancer pathway escalates.** A suspected-malignancy / cancer-staging
  indication makes the request two-week-wait eligible and raises the triage tier.
- **Bleeding risk is explicit.** Anticoagulant / antiplatelet use, INR, platelet
  count, and bleeding disorder drive a band plus a periprocedural action.
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

- Curated low-risk / high-bleeding-risk / 2WW example fixtures.
- ACR appropriateness lookup table per (indication × site × method).
- BSG/ESGE periprocedural anticoagulation decision table per agent.
