# Blood Cross-Match Test Request — plan

## Current status

Scaffolded and brought to foundation depth: SQL schema (source of truth) is in
place. Generated derivatives (XML, FHIR R5, protobuf, OpenAPI, Loco setup,
examples, spec, changelog) and the front-end / back-end apps are the remaining
depth work.

## Why this form exists

Transfusion laboratories vet incoming compatibility requests by clinical acuity,
appropriateness, and — above all — identity safety, but referral quality varies.
The clinical indication, blood group, and sample / two-sample status are the
most commonly omitted, highest-value fields, and Wrong Blood in Tube (WBIT) is a
never event. This form makes the request structured and gradeable so vetting is
consistent, auditable, and aligned with NICE NG24, BSH, and SHOT guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, identity / sample safety,
  completeness, and triage are independent and each citable to a recognized
  body. A request can be appropriate yet identity-unsafe, or complete yet stat.
- **Red-flags auto-escalate.** Declared major / massive haemorrhage, instability,
  or active uncontrolled bleeding forces emergency / stat triage regardless of
  the other axes.
- **Identity safety is paramount.** The BSH/SHOT two-sample (group-check) rule
  and positive patient identification gate the identity-safety axis and can drive
  a reject-risk band.
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

- Curated routine / urgent / reject-risk example fixtures.
- NICE NG24 threshold lookup per (indication × component × clinical context).
- Auto-flag two-sample-rule-not-met from sample collection events.
