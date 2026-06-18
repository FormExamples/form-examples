# Nuclear Medicine Test Request — plan

## Current status

Scaffolded to foundation depth: the SQL schema (source of truth) and the form's
authoring documents are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Nuclear-medicine departments must justify every radionuclide exposure under
IR(ME)R and triage incoming requests by clinical acuity and appropriateness, but
referral quality varies — the indication, the specific clinical question, and the
radiation-safety status (pregnancy, breastfeeding) are the most commonly omitted,
highest-value fields. This form makes the request structured and gradeable so
vetting is consistent, auditable, and aligned with ACR / RCR iRefer / ARSAC /
IR(ME)R / EANM–SNMMI guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, preparation & radiation safety,
  completeness, and triage are independent and each citable to a recognised
  body. A request can be appropriate yet unsafe to perform now, or complete yet
  urgent.
- **Safety drives the prep band.** Confirmed / possible pregnancy and
  breastfeeding with a long-retention radiopharmaceutical push the prep-safety
  band toward caution / contraindicated regardless of the other axes.
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

- Curated low-dose / high-dose / contraindicated example fixtures.
- ACR / RCR iRefer appropriateness lookup table per (indication × scan type).
- Administered-activity calculator from weight and radiopharmaceutical.
