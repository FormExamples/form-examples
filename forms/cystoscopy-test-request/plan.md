# Cystoscopy Test Request — plan

## Current status

Scaffolded to foundation depth: the SQL schema (source of truth) and the form's
authoring docs are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Urology departments triage incoming cystoscopy requests by cancer risk and
appropriateness, but referral quality varies — the indication and specific
clinical question are the most commonly omitted, highest-value fields. This form
makes the request structured and gradeable so vetting is consistent, auditable,
and aligned with NICE NG12 and BAUS haematuria guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, cancer-pathway urgency,
  completeness, and pre-procedure risk are independent and each citable. A
  request can be appropriate yet incomplete, or complete yet urgent.
- **Red flags auto-escalate or defer.** Visible haematuria meeting the 2WW
  threshold forces the two-week-wait tier; active UTI defers the procedure;
  high bleeding risk on anticoagulation raises the risk band.
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

- Curated low-risk / urgent / 2WW example fixtures.
- NICE NG12 age-threshold lookup driven from patient date of birth.
- Anticoagulation peri-procedural hold guidance per agent.
