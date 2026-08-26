# Bronchoscopy Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the root and
per-subdirectory AI documentation are in place. The generated derivatives (XML,
FHIR R5, protobuf, OpenAPI, Loco setup, examples, spec, changelog), front-end
apps, and the Loco back-end crate are the remaining depth work.

## Why this form exists

Bronchoscopy services triage incoming requests by clinical acuity,
appropriateness, and bleeding / hypoxia risk, but referral quality varies — the
indication and specific clinical question are the most commonly omitted,
highest-value fields, and anticoagulation status is safety-critical. This form
makes the request structured and gradeable so vetting is consistent, auditable,
and aligned with BTS bronchoscopy and NICE NG12 guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, cancer-pathway urgency,
  completeness, and pre-procedure risk are independent and each citable to a
  recognized body. A request can be appropriate yet incomplete, or complete yet
  high-risk.
- **Emergencies auto-escalate.** Massive haemoptysis or haemodynamic instability
  forces emergency triage regardless of the other axes.
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

- Curated low-risk / two-week-wait / high-bleeding-risk example fixtures.
- BTS appropriateness lookup table per (indication × procedure).
- Anticoagulation peri-procedure management lookup (agent × procedure × biopsy).
