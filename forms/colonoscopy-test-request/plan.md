# Colonoscopy Test Request — plan

## Current status

Scaffolded to foundation depth: the SQL schema (source of truth) and the form's
authoring docs (index, AGENTS, plan, tasks, doc) are in place. Generated
derivatives (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, spec,
changelog), the front-end apps, and the Loco back-end crate are the remaining
depth work.

## Why this form exists

Endoscopy units triage incoming colonoscopy requests by cancer-pathway acuity
and appropriateness, but referral quality varies — the indication, specific
clinical question, and FIT result are the most commonly omitted, highest-value
fields. This form makes the request structured and gradeable so vetting is
consistent, auditable, and aligned with NICE NG12 / DG56 / BSG / ESGE / ASGE
guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, cancer-pathway urgency,
  completeness, and pre-procedure risk are independent and each citable to a
  recognised body. A request can be appropriate yet incomplete, or complete yet
  urgent or high-risk.
- **Cancer-pathway escalation.** A positive FIT (≥10 µg Hb/g) or NICE NG12
  lower-GI red-flag combination escalates to two-week-wait; an acute emergency
  presentation auto-escalates to emergency.
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

- Curated low-risk / two-week-wait / high-bleeding-risk example fixtures.
- ASGE / EPAGE appropriateness lookup table per (indication × procedure).
- Auto-derive anticoagulant action from agent + procedure bleeding risk.
