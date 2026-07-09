# Urinalysis Test Request — plan

## Current status

Scaffolded to foundation depth: the SQL schema (source of truth) and the form
documentation set (index, AGENTS, plan, tasks, doc) are in place. Generated
derivatives (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, spec,
changelog), the front-end apps, and the Loco back-end crate are the remaining
depth work.

## Why this form exists

Laboratories and pathology services triage incoming urine requests by acuity and
appropriateness, but referral quality varies — the clinical details and
indication are the most commonly omitted, highest-value fields, and specimen
preanalytical quality (type, timing, contamination) drives whether a sample can
be processed at all. This form makes the order structured and gradeable so
vetting is consistent, auditable, and aligned with NICE NG109 / NG12 / UK SMI
B41 guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, preanalytical specimen suitability,
  completeness, and triage are independent and each citable. A request can be
  appropriate yet have an unsuitable specimen, or complete yet urgent.
- **Red flags auto-escalate.** Visible haematuria and fever + loin pain force
  urgent / stat triage and raise safety flags regardless of the other axes.
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

- Curated low-risk / urgent / reject-risk example fixtures.
- Indication × test-panel appropriateness lookup table.
- Auto-derive specimen age from collection date-time and warn beyond 4 h.
