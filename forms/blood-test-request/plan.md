# Blood Test Request — plan

## Current status

Scaffolded to **foundation depth**: the SQL schema (source of truth) and the
form-root and subdirectory documentation are in place. Generated derivatives
(XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, spec, changelog),
front-end apps, and the Loco back-end crate are the remaining depth work.

## Why this form exists

Laboratories receive a high volume of blood-test requests, but ordering quality
varies: tests are repeated inside their minimum retesting interval, the clinical
indication is omitted, or fasting-required tests are collected non-fasting. This
form makes the request structured and gradeable so vetting is consistent,
auditable, and aligned with RCPath / ACB *National Minimum Retesting Intervals*
guidance.

## Design principles

- **Panels, not one procedure.** Requested tests are BOOLEAN columns on the main
  record; at least one must be selected (no-test-selected otherwise fires).
- **Four orthogonal axes.** Appropriateness, pre-analytical / specimen safety,
  completeness, and triage are independent. A request can be appropriate yet
  have a fasting violation, or complete yet stat-urgent.
- **Critical tests + stat escalate.** A `stat` urgency or a critical test
  (troponin, d-dimer, blood culture, crossmatch) escalates triage.
- **Pure scoring engine.** Deterministic function with stable rule IDs shared
  across every front-end and the back-end.
- **Schema is the source of truth.** Everything downstream is generated.
- **Single-page wizard.** One continuous form, no multi-page navigation.
- **1–9 is anchored, not validated.** No single published 1–9 score exists for
  bloods; the scale is anchored on retesting-interval appropriateness +
  indication match.

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

- Curated routine / urgent / stat / fasting-violation example fixtures.
- RCPath minimum-retesting-interval lookup table per panel.
- Auto-derive fasting_required from the selected panels.
