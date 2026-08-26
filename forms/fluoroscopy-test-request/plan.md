# Fluoroscopy Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) plus the root and
subdirectory AI doc files are in place. Generated derivatives (XML, FHIR R5,
protobuf, OpenAPI, Loco setup, examples, spec, changelog), the front-end apps,
and the Loco back-end crate are the remaining depth work.

## Why this form exists

Imaging departments triage incoming fluoroscopy / contrast-study requests by
clinical acuity, appropriateness, and radiation safety, but referral quality
varies — the indication, the specific clinical question, and the IR(ME)R
justification are the most commonly omitted, highest-value fields. This form
makes the request structured and gradeable so vetting is consistent, auditable,
and aligned with ACR Appropriateness Criteria, RCR iRefer, and IR(ME)R.

## Design principles

- **Four orthogonal axes.** Appropriateness, safety + radiation dose,
  completeness, and triage are independent and each citable to a recognized
  body. A request can be appropriate yet unsafe, or complete yet urgent.
- **Safety contraindications dominate.** Pregnancy with an ionizing study, and
  barium chosen when perforation is suspected (use water-soluble contrast),
  drive the safety band to `contraindicated` and a redirect / query.
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
- ACR appropriateness lookup table per (indication × study type).
- Study-type → radiation-dose-band lookup refinement from local DRLs.
