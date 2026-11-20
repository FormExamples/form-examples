---
name: united-states-social-security-card-application-skill
description: "Explains what the United States Social Security Card Application (Form SS-5) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United States Social Security Card Application (Form SS-5)

A single-page, step-by-step questionnaire for Form SS-5, the application for an original, replacement, or corrected Social Security card. It checks the form and the evidence the applicant plans to bring against the Social Security Administration (SSA) rules, classifies the application as **Ready to submit**, **Incomplete**, **Evidence missing**, or **Not eligible**, and raises prioritized flagged issues. It is documentation support, not legal advice, and SSA decides every application. The Social Security number is never collected.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-states-social-security-card-application-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
