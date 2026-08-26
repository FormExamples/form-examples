# Cardiac Stress Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the per-form
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Cardiac-investigations departments triage incoming stress-test requests by
clinical acuity, safety, and appropriateness, but referral quality varies — the
indication and specific clinical question are the most commonly omitted,
highest-value fields, and safety contraindications (recent ACS, severe aortic
stenosis) must never be missed. This form makes the request structured and
gradeable so vetting is consistent, auditable, and aligned with ACC/AHA and ESC
guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, safety / contraindication,
  completeness, and triage are independent and each citable to a recognized
  body. A request can be appropriate yet unsafe to perform as requested.
- **Safety contraindications block or escalate.** Recent ACS, severe
  symptomatic aortic stenosis, uncontrolled hypertension, or inability to
  exercise drive the safety axis regardless of the other axes.
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

- ACC/AHA AUC lookup table per (indication × test type × pre-test likelihood).
- Auto-redirect exercise requests to a pharmacological modality when the
  patient cannot exercise.
- Curated low-risk / urgent / contraindicated example fixtures.
