# Sleep Study Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the form's
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Sleep services triage incoming study requests by clinical acuity and
appropriateness, but referral quality varies — the indication, specific
clinical question, and Epworth score are the most commonly omitted,
highest-value fields. This form makes the request structured and gradeable so
vetting is consistent, auditable, and aligned with NICE NG202 / SIGN / Epworth /
STOP-BANG / DVLA guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, clinical priority, completeness,
  and triage are independent and each citable to a recognized body. A request
  can be appropriate yet incomplete, or complete yet urgent.
- **Vocational driving auto-escalates.** An occupational driver with excessive
  sleepiness, or severe daytime sleepiness, forces urgent triage regardless of
  the other axes (DVLA).
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

- Curated low-priority / urgent / vocational-driver example fixtures.
- Epworth + STOP-BANG appropriateness lookup table per (indication × study type).
- Auto-suggest study type from indication (HSAT vs PSG vs MSLT).
