# CT Scan Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the form-level
documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Imaging departments triage and protocol incoming CT requests by clinical
acuity, appropriateness, and radiation / contrast safety, but referral quality
varies — the indication, the specific clinical question, the IR(ME)R
justification, and the renal function (eGFR) are the most commonly omitted,
highest-value fields. This form makes the request structured and gradeable so
vetting is consistent, auditable, and aligned with ACR / RCR iRefer / ESUR /
IR(ME)R guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, radiation / contrast safety,
  completeness, and triage are independent and each citable to a recognised
  body. A request can be appropriate yet unsafe for contrast, or complete yet
  urgent.
- **Safety conditions escalate.** Pregnancy with planned exposure, severe
  contrast allergy, or low eGFR with IV contrast escalate flags and can force
  the contrast-safety band to *contraindicated*.
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

- Curated low-risk / urgent / contraindicated-contrast example fixtures.
- ACR appropriateness lookup table per (indication × body region).
- eGFR-banded contrast-safety decision table aligned to ESUR thresholds.
