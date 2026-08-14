# Nerve Conduction Study Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) is in place along
with the root and per-subdirectory AI documentation. Generated derivatives
(XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, spec, changelog),
front-end apps, and the Loco back-end crate are the remaining depth work.

## Why this form exists

Neurophysiology departments triage incoming nerve conduction / EMG requests by
clinical acuity and appropriateness, but referral quality varies — the
indication and specific clinical question are the most commonly omitted,
highest-value fields, and needle-EMG safety factors (anticoagulation, cardiac
devices) are frequently not recorded. This form makes the request structured
and gradeable so vetting is consistent, auditable, and aligned with AANEM / AAN
electrodiagnostic practice parameters.

## Design principles

- **Four orthogonal axes.** Appropriateness, procedural risk, completeness, and
  triage are independent and each citable to a recognized body. A request can be
  appropriate yet incomplete, or complete yet procedurally risky.
- **Suspected MND auto-escalates.** A suspected motor-neurone-disease indication
  forces urgent triage regardless of the other axes.
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

- Curated routine / urgent / high-procedural-risk example fixtures.
- AANEM appropriateness lookup table per (indication × study type × region).
- Auto-suggest study type and region from the recorded indication.
