# Electroencephalogram Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) is in place along
with the form's documentation set. Generated derivatives (XML, FHIR R5,
protobuf, OpenAPI, Loco setup, examples, spec, changelog), the front-end apps,
and the Loco back-end crate are the remaining depth work.

## Why this form exists

Neurophysiology departments triage incoming EEG requests by clinical acuity and
appropriateness, but referral quality varies — the indication and specific
clinical question are the most commonly omitted, highest-value fields. This form
makes the request structured and gradeable so vetting is consistent, auditable,
and aligned with NICE NG217 and ILAE guidance for the role and limitations of
EEG.

## Design principles

- **Four orthogonal axes.** Appropriateness, urgency, completeness, and clinical
  priority are independent and each citable to a recognised body. A request can
  be appropriate yet incomplete, or complete yet urgent.
- **Status epilepticus auto-escalates.** Suspected status epilepticus forces
  emergency triage regardless of the other axes.
- **EEG does not exclude epilepsy.** Per NICE NG217, a normal EEG must not be
  used to rule out epilepsy; the engine flags requests whose clinical question
  implies otherwise.
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

- Curated routine / urgent / inappropriate example fixtures.
- NICE NG217 appropriateness lookup table per (indication × EEG type).
- Detect "exclude epilepsy" phrasing in the clinical question automatically.
