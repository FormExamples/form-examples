# Toxicology Test Request — plan

## Current status

Scaffolded to foundation depth: SQL schema (source of truth) and the form's AI
doc files are in place. Generated derivatives (XML, FHIR R5, protobuf, OpenAPI,
Loco setup, examples, spec, changelog), the front-end apps, and the Loco
back-end crate are the remaining depth work.

## Why this form exists

Toxicology and poisons assays are time-critical and easy to mis-order: a
paracetamol level taken before 4 h post-ingestion cannot be plotted on the
treatment nomogram, deliberate overdoses need stat handling and safeguarding,
and the clinical details that make a level interpretable are the most commonly
omitted, highest-value fields. This form makes the request structured and
gradeable so vetting is consistent, auditable, and aligned with TOXBASE / NPIS
and RCEM guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, timing validity, completeness, and
  triage are independent. A request can be appropriate yet mistimed, or complete
  yet stat.
- **Timing is first-class.** The paracetamol ≥ 4 h nomogram rule is a dedicated
  axis, not buried in completeness.
- **Overdose / self-harm auto-escalate.** Deliberate overdose or a symptomatic
  patient forces `stat` triage and a safeguarding flag.
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

- Curated example fixtures (valid paracetamol, < 4 h paracetamol, deliberate
  overdose, therapeutic-drug-monitoring).
- TOXBASE indication-to-assay appropriateness lookup table.
- Auto-derive timing band from collection_datetime vs estimated ingestion time.
