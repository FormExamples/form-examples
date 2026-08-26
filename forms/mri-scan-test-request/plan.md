# MRI Scan Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the form's
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Imaging departments must vet every MRI request for clinical appropriateness and,
critically, for MRI safety before a patient enters the bore. Referral quality
varies — the indication, specific clinical question, and the implant safety
screen are the most commonly omitted, highest-value fields. This form makes the
request structured and gradeable so vetting is consistent, auditable, and
aligned with ACR Appropriateness Criteria, the ACR Manual on MR Safety, MHRA
guidance, and ESUR / RCR gadolinium guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, MRI safety, completeness, and
  triage are independent and each citable to a recognized body. A request can be
  appropriate yet unsafe to scan, or complete yet urgent.
- **Safety dominates.** A positive ferromagnetic / electronic implant screen
  drives the safety band to needs-mri-physics-review or contraindicated, and
  gadolinium with eGFR < 30 is a contrast-renal contraindication.
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

- Curated cleared / conditional / contraindicated example fixtures.
- ACR appropriateness lookup table per (indication × body region).
- MR-conditional implant lookup to auto-classify the safety band.
