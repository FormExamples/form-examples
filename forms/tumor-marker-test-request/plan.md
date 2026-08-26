# Tumor Marker Test Request — plan

## Current status

Scaffolded to foundation depth: the SQL schema (source of truth) and the form's
authored documentation are in place. Generated derivatives (XML, FHIR R5,
protobuf, OpenAPI, Loco setup, examples, spec, changelog), the front-end apps,
and the Loco back-end crate are the remaining depth work.

## Why this form exists

Tumour markers are frequently over-requested and misused as screening tests,
producing false positives, anxiety, and unnecessary downstream investigation.
This form makes the request structured and gradeable so requesting is
consistent, auditable, and aligned with NICE (CA125, PSA) and ACB / RCPath
tumour-marker guidance — flagging marker-to-indication mismatch and
inappropriate screening use before the sample reaches the laboratory.

## Design principles

- **Four orthogonal axes.** Appropriateness, interpretation safety,
  completeness, and urgency are independent and each citable to a recognized
  body. A request can be appropriate yet incomplete, or appropriate yet carry
  interpretation risk.
- **Discourage screening misuse.** Markers requested as broad screening force
  the misuse-risk interpretation band and an inappropriate-screening-use flag.
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

- Curated appropriate / inappropriate-screening / mismatch example fixtures.
- Marker-to-indication appropriateness lookup table per (marker × indication).
- RCPath minimum-retesting-interval check against `previous_marker_date`.
