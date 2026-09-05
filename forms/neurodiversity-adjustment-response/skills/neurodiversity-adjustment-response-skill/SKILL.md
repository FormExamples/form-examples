---
name: neurodiversity-adjustment-response-skill
description: "Explains what the Neurodiversity Adjustment Response form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Neurodiversity Adjustment Response

A UK–aligned **workplace reasonable-adjustments response for neurodiversity** that an employer (line manager, HR adviser, or occupational-health lead) completes in answer to a request for adjustments. It is the **response / confirmation counterpart** to [`neurodiversity-adjustment-request`](../neurodiversity-adjustment-request): where the request captures *what a neurodivergent worker needs and why*, this form records *what the employer has decided, what has been agreed, and how it will be reviewed*. It records the overall decision and its rationale, which adjustments were agreed (and any alternatives offered), the trial period and review date, support / resources / responsibilities, and any escalation — then computes a **four-axis grade** (outcome classification, legal / discrimination risk, response completeness, and follow-up / review urgency) plus a set of compliance-and-risk flags including an automatic **discrimination-risk alert**. The output is a structured confirmation-and-review record.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `neurodiversity-adjustment-response-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
