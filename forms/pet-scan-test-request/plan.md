# PET Scan Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the per-form
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Nuclear-medicine / PET-CT departments triage incoming requests by clinical
acuity, appropriateness, and patient-preparation safety, but referral quality
varies — the indication, the specific clinical question, and the glucose value
for FDG studies are the most commonly omitted, highest-value fields. This form
makes the request structured and gradeable so vetting is consistent, auditable,
and aligned with ACR / RCR iRefer appropriateness, EANM / SNMMI FDG preparation,
and IR(ME)R justification.

## Design principles

- **Four orthogonal axes.** Appropriateness, preparation safety & radiation
  dose, completeness, and triage are independent and each citable to a
  recognised body. A request can be appropriate yet unsafe to prepare, or
  complete yet urgent.
- **Safety forces the band.** Pregnancy or uncontrolled glucose force the
  caution / contraindicated safety band and a flag regardless of other axes.
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

- Curated routine / urgent / contraindicated example fixtures.
- ACR / iRefer appropriateness lookup table per (indication × scan type).
- Auto-classify radiation-dose band from scan type plus CT extent.
