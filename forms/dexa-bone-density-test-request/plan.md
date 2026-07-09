# DEXA Bone Density Test Request — plan

## Current status

Foundation scaffolded: SQL schema (source of truth) and root/subdirectory
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Imaging departments triage incoming DEXA requests by appropriateness and
acuity, but referral quality varies — the indication and specific clinical
question are the most commonly omitted, highest-value fields. This form makes
the request structured and gradeable so vetting is consistent, auditable, and
aligned with NICE CG146 / NOGG / FRAX / ISCD guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, radiation safety, completeness, and
  triage are independent and each citable to a recognised body. A request can be
  appropriate yet incomplete, or complete yet urgent.
- **Acuity escalates triage.** Recent fragility fracture, very high FRAX risk,
  or long-term high-dose steroids escalate triage regardless of other axes.
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

- Curated routine / urgent / outside-threshold example fixtures.
- FRAX intervention-threshold lookup keyed to age and NOGG bands.
- Auto-flag duplicate DEXA within the ISCD least-significant-change interval.
