# Holter Monitor Test Request — plan

## Current status

Scaffolded to foundation depth: the SQL schema (source of truth) and the form's
authoring docs are in place. The generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Cardiac physiology departments triage incoming ambulatory ECG requests by
clinical acuity and appropriateness, but referral quality varies — the
indication and specific clinical question are the most commonly omitted,
highest-value fields, and monitor duration is often mismatched to symptom
frequency. This form makes the request structured and gradeable so vetting is
consistent, auditable, and aligned with ACC/AHA / ISHNE-HRS / NICE NG196 / ESC
guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, urgency/triage, completeness, and
  clinical priority are independent and each citable to a recognised body. A
  request can be appropriate yet incomplete, or complete yet urgent.
- **Red-flags auto-escalate.** Any red flag (syncope, suspected VT, post-stroke
  AF detection) forces urgent / emergency triage regardless of the other axes.
- **Symptom-frequency / monitor matching.** The engine flags a mismatch when the
  requested monitor duration cannot capture the patient's symptom frequency.
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

- Curated low-risk / urgent / mismatch example fixtures.
- Appropriateness lookup table per (indication × monitor type × symptom frequency).
- Auto-suggest monitor type from symptom frequency.
