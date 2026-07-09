# Allergy Skin Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the form's
authoring documents (index, AGENTS, plan, tasks, doc) are in place. Generated
derivatives (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, spec,
changelog), the front-end apps, and the Loco back-end crate are the remaining
depth work.

## Why this form exists

Allergy services triage incoming testing requests by acuity and
appropriateness, but referral quality varies — the indication, specific clinical
question, and allergen selection are the most commonly omitted, highest-value
fields, and a critical pre-analytic detail (current antihistamine use) is often
missing. This form makes the request structured and gradeable so vetting is
consistent, auditable, and aligned with BSACI / EAACI guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, validity and safety, completeness,
  and triage are independent and each citable to a recognised body. A request
  can be appropriate yet invalid (patient on antihistamines), or complete yet
  urgent.
- **Validity rules are first-class.** Antihistamines invalidate skin-prick /
  intradermal tests; a beta-blocker with anaphylaxis history and active skin
  disease raise caution / contraindication and can redirect to specific-IgE.
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
- BSACI / EAACI appropriateness lookup table per (indication × test type).
- Antihistamine washout calculator (five half-lives by agent).
