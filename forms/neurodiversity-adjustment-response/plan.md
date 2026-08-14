# Neurodiversity Adjustment Response — plan

## Current status

Foundation build. SQL schema (source of truth) and per-form documentation are in
place; generated derivatives follow. Front-ends and the Loco back-end crate are
deferred to a later pass, consistent with the request/response form family.

## Why this form exists

An employer's duty under the Equality Act 2010 is not discharged by receiving a
request — it is discharged by *deciding*, *implementing*, and *reviewing*
reasonable adjustments without unreasonable delay, and by being able to justify
any decline on reasonableness grounds. A poorly recorded decision (no rationale,
no alternatives, no review) is the classic evidential gap in a
failure-to-make-reasonable-adjustments claim. This form makes the employer's
reply structured, gradeable for legal risk, and auditable. It is the **response**
half of the pair with
[`neurodiversity-adjustment-request`](../neurodiversity-adjustment-request).

## Design principles

- **Four orthogonal axes.** Outcome, legal / discrimination risk, completeness,
  and follow-up urgency are independent and each anchored to a recognized source.
- **Declines escalate risk.** Declining adjustments a worker is likely entitled
  to, without justification or alternatives, drives the legal-risk axis and
  raises the discrimination-risk flag.
- **Trial and review first-class.** The ACAS emphasis on trying and regularly
  reviewing adjustments is captured as structured fields, not free text.
- **Pure scoring engine.** Deterministic function with stable rule IDs shared
  across every front-end and the back-end.
- **Schema is the source of truth.** Everything downstream is generated.
- **Single-page wizard.** One continuous form, no multi-page navigation.

## Build order

1. [x] SQL migrations (worker, manager, response, grade, grade_rule, grade_flag)
2. [x] index.md / AGENTS.md / plan.md / tasks.md
3. [ ] Generated representations (XML, FHIR R5, protobuf, OpenAPI)
4. [ ] Loco setup script, examples, spec, CHANGELOG.md
5. [ ] front-end-with-html (consolidated HTML wizard + dashboard + JS four-axis engine)
6. [ ] front-end-with-svelte (consolidated SvelteKit wizard + dashboard + TS engine)
7. [ ] back-end-with-loco (Rust JSON API crate)

## Future enhancements

- Curated example fixtures (fully-agreed / partially-agreed / high-legal-risk).
- Reasonableness-test decision aid for the decline path.
- Review reminders driven by `review_date`.
