# Eye Vision Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) is in place. The
generated derivatives (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples,
spec, changelog), the front-end apps, and the Loco back-end crate are the
remaining depth work.

## Why this form exists

Eye-care services triage incoming ophthalmic requests by clinical acuity and
appropriateness, but referral quality varies — the indication and specific
clinical question are the most commonly omitted, highest-value fields. This form
makes the request structured and gradeable so vetting is consistent, auditable,
and aligned with RCOphth / NICE NG81 / NHS Diabetic Eye Screening guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, urgency / triage priority,
  completeness, and clinical priority are independent and each citable to a
  recognized body. A request can be appropriate yet incomplete, or complete yet
  urgent.
- **Red-flags auto-escalate.** Any red flag (sudden visual loss, retinal
  detachment symptoms, acute painful red eye, suspected GCA) forces emergency
  triage regardless of the other axes.
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

- Curated routine / urgent / emergency example fixtures.
- RCOphth appropriateness lookup table per (indication × test type).
- Auto-suggest the recommended test type from the primary indication.
