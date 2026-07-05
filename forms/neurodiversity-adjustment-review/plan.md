# Neurodiversity Adjustment Review — plan

## Current status

Full-stack build. SQL schema (source of truth), docs, and generated derivatives
are in place; the three app stacks follow, mirroring the request/response pair.

## Why this form exists

The Equality Act duty is not discharged by agreeing adjustments once — ACAS is
explicit that adjustments should be tried and **reviewed regularly** to stay
effective as roles and needs change. A failing adjustment that no one reviews is
a live risk to the worker and to the employer's compliance. This form makes the
review structured, gradeable, and auditable, completing the ACAS
request / confirmation / review cycle.

## Design principles

- **Four orthogonal axes.** Effectiveness, wellbeing risk, completeness, and
  next-step urgency are independent.
- **Failing adjustments escalate.** A not-working adjustment, dissatisfied
  worker, declining wellbeing, or escalation drives wellbeing risk and next-step
  urgency and raises the matching flag.
- **Per-category effectiveness.** Each ACAS adjustment category in place is rated
  working-well / partial / not-working / not-in-place.
- **Pure scoring engine.** Deterministic, stable rule IDs shared across stacks.
- **Schema is the source of truth.** Everything downstream is generated.
- **Single-page wizard.** One continuous form.

## Build order

1. [x] SQL migrations (worker, manager, review, grade, grade_rule, grade_flag)
2. [x] index.md / AGENTS.md / plan.md / tasks.md / spec
3. [x] Generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, CHANGELOG, llms.txt)
4. [ ] front-end-with-html (wizard + dashboard + JS four-axis engine)
5. [ ] front-end-with-svelte (SvelteKit wizard + dashboard + TS engine)
6. [ ] back-end-with-loco (Rust JSON API crate)

## Future enhancements

- Consume a handoff from the response form (pre-fill worker/manager + the agreed
  categories as the ones to review).
- Review-reminder scheduling driven by `next_review_date`.
