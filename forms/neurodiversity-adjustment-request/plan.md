# Neurodiversity Adjustment Request — plan

## Current status

Foundation build. SQL schema (source of truth) and per-form documentation are in
place; generated derivatives follow. Front-ends and the Loco back-end crate are
deferred to a later pass, consistent with the request/response form family.

## Why this form exists

Neurodivergent workers are often disadvantaged at work by environments and
processes designed around neurotypical assumptions, yet requests for adjustments
are frequently informal, incomplete, or lost. Under the Equality Act 2010 an
employer has a duty to make reasonable adjustments once it knows (or could
reasonably be expected to know) a worker is disabled, and being neurodivergent
will often meet that test. This form makes the request structured, gradeable, and
auditable so employers can respond consistently and without unreasonable delay.
It is the **request** half of the pair with
[`neurodiversity-adjustment-response`](../neurodiversity-adjustment-response).

## Design principles

- **Four orthogonal axes.** Eligibility (Equality Act), impact / wellbeing,
  completeness, and priority are independent and each anchored to a recognised
  source.
- **Wellbeing escalates.** A worker at risk of absence / burnout, or with severe
  impact, drives the impact axis and auto-escalates the priority tier.
- **No diagnosis gate.** A formal diagnosis is not required; self-identification
  and the substantial + long-term test drive eligibility.
- **Pure scoring engine.** Deterministic function with stable rule IDs shared
  across every front-end and the back-end.
- **Schema is the source of truth.** Everything downstream is generated.
- **Single-page wizard.** One continuous form, no multi-page navigation.
- **ACAS-mapped.** Functional difficulties and requested adjustments follow the
  ACAS functional areas and adjustment categories.

## Build order

1. [x] SQL migrations (worker, manager, request, grade, grade_rule, grade_flag)
2. [x] index.md / AGENTS.md / plan.md / tasks.md
3. [ ] Generated representations (XML, FHIR R5, protobuf, OpenAPI)
4. [ ] Loco setup script, examples, spec, CHANGELOG.md
5. [ ] front-end-with-html (consolidated HTML wizard + dashboard + JS four-axis engine)
6. [ ] front-end-with-svelte (consolidated SvelteKit wizard + dashboard + TS engine)
7. [ ] back-end-with-loco (Rust JSON API crate)

## Future enhancements

- Curated example fixtures (likely-covered / high-risk / incomplete).
- Access to Work signposting content and links.
- Optional occupational-health referral hand-off to the response form.
