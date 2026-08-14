# Histopathology Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the form's
clinical documentation are in place. Generated derivatives (XML, FHIR R5,
protobuf, OpenAPI, Loco setup, examples, spec, changelog), the front-end apps,
and the Loco back-end crate are the remaining depth work.

## Why this form exists

Histopathology laboratories accession and triage incoming tissue requests by
clinical acuity and appropriateness, but referral quality varies — the
indication and specific clinical question are the most commonly omitted,
highest-value fields, and specimen-handling errors (wrong fixative, poor
labelling, leaking pots) risk specimen rejection. This form makes the request
structured and gradeable so vetting is consistent, auditable, and aligned with
RCPath cancer datasets / tissue pathways and NICE NG12.

## Design principles

- **Four orthogonal axes.** Appropriateness, specimen quality, completeness, and
  urgency are independent and each citable to a recognized body. A request can
  be appropriate yet incomplete, or complete yet a specimen-reject risk.
- **Red-flags auto-escalate.** A two-week-wait suspected-cancer request or an
  urgent frozen section forces the urgency tier (frozen section → immediate)
  regardless of the other axes.
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

- Curated routine / urgent / 2WW / reject-risk example fixtures.
- Appropriateness lookup table per (indication × specimen type).
- Specimen-quality rules tuned per RCPath tissue pathway.
