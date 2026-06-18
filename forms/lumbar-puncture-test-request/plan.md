# Lumbar Puncture Test Request — plan

## Current status

Scaffolded to foundation depth: the SQL schema (source of truth) and the form's
AI documentation are in place. Generated derivatives (XML, FHIR R5, protobuf,
OpenAPI, Loco setup, examples, spec, changelog), the front-end apps, and the
Loco back-end crate are the remaining depth work.

## Why this form exists

Neurology and acute-medicine teams triage incoming lumbar puncture requests by
clinical acuity, appropriateness, and — critically — procedural safety: an LP in
a patient with raised intracranial pressure risks cerebral herniation, and an LP
in an anticoagulated or thrombocytopenic patient risks spinal haematoma. This
form makes the request structured and gradeable so vetting is consistent,
auditable, and aligned with NICE NG240, SAH / CSF-xanthochromia guidance, and
ABN LP-safety guidance.

## Design principles

- **Four orthogonal axes.** Appropriateness, safety / contraindication,
  completeness, and triage are independent. A request can be appropriate yet
  unsafe until imaging or coagulation correction is done.
- **Red-flags auto-escalate.** Suspected meningitis or subarachnoid haemorrhage
  forces emergency triage regardless of the other axes.
- **Safety first.** Raised ICP without prior imaging, coagulopathy,
  anticoagulation, thrombocytopenia, and local infection drive the
  contraindication band and raise high-priority flags.
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

- Curated low-risk / urgent / contraindicated example fixtures.
- Indication × intent appropriateness lookup table.
- DOAC-specific timing guidance (hold / resume intervals) in the safety axis.
