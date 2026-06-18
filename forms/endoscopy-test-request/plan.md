# Endoscopy Test Request — plan

## Current status

Scaffolded and brought to foundation depth: SQL schema (source of truth) is in
place. Generated derivatives (XML, FHIR R5, protobuf, OpenAPI, Loco setup,
examples, spec, changelog), the front-end apps, and the Loco back-end crate are
the remaining depth work.

## Why this form exists

Endoscopy units triage incoming requests by clinical acuity, suspected-cancer
pathway eligibility, appropriateness, and procedural risk — but referral quality
varies. The indication, specific clinical question, and FIT result are the most
commonly omitted, highest-value fields. This form makes the request structured
and gradeable so vetting is consistent, auditable, and aligned with NICE NG12 /
DG56, BSG / ESGE anticoagulation guidance, Glasgow-Blatchford / Rockall, and
ASA / ACR / ASGE appropriate-use guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, cancer-pathway urgency,
  completeness, and pre-procedure risk are independent and each citable. A
  request can be appropriate yet incomplete, or complete yet high-risk.
- **Red-flags auto-escalate.** Acute GI bleeding / instability forces emergency
  triage; NICE NG12 / DG56 criteria force the two-week-wait tier.
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

- Curated routine / two-week-wait / high-bleeding-risk example fixtures.
- ACR / ASGE appropriateness lookup table per (indication × procedure).
- Auto-compute Glasgow-Blatchford and Rockall from entered observations.
