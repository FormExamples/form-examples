# Ambulatory Blood Pressure Test Request — plan

## Current status

Scaffolded and brought to foundation depth: SQL schema (source of truth) and the
per-subdirectory AI documentation are in place. Generated derivatives (XML,
FHIR R5, protobuf, OpenAPI, Loco setup, examples, spec, changelog), the
front-end apps, and the Loco back-end crate are the remaining depth work.

## Why this form exists

Monitoring services triage incoming ABPM requests by appropriateness and
acuity, but referral quality varies — the indication, specific clinical
question, and clinic blood pressure are the most commonly omitted, highest-value
fields. This form makes the request structured and gradeable so vetting is
consistent, auditable, and aligned with NICE NG136 and BIHS guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, suitability, completeness, and
  triage are independent and each citable to a recognised body. A request can be
  appropriate yet incomplete, or complete yet urgent.
- **Severe BP auto-escalates.** Clinic BP ≥180/120 mmHg forces urgent / same-day
  triage regardless of the other axes (NICE NG136).
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

- Curated low-risk / urgent / limited-suitability example fixtures.
- NICE NG136 appropriateness lookup table per (indication × clinic BP band).
- Validated-device cross-check against the BIHS monitor list.
