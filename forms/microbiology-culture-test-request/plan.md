# Microbiology Culture Test Request — plan

## Current status

Scaffolded to foundation depth: the SQL schema (source of truth) and the root
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Microbiology laboratories triage incoming culture requests by clinical acuity
and appropriateness, but referral quality varies — clinical details, the primary
indication, and correct pre-analytical specimen handling are the most commonly
omitted, highest-value elements. This form makes the request structured and
gradeable so vetting is consistent, auditable, and aligned with UKHSA SMI and
NICE NG51 guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, pre-analytical specimen safety,
  completeness, and triage are independent and each citable. A request can be
  appropriate yet pre-analytically unsafe, or complete yet urgent.
- **Sepsis auto-escalates.** Suspected sepsis forces `stat` triage regardless of
  the other axes (NICE NG51).
- **Sample before antibiotics.** Blood cultures should be drawn before the first
  antibiotic dose; a flag fires otherwise.
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

- Curated routine / urgent / stat example fixtures.
- SMI specimen-selection lookup table per (specimen × indication).
- Pre-analytical transport-clock validation from `collection_datetime`.
