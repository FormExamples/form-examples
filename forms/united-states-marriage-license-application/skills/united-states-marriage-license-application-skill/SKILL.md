---
name: united-states-marriage-license-application-skill
description: "Explains what the United States Marriage License Application form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United States Marriage License Application

A single-page, step-by-step questionnaire for applying for a United States marriage license and, after the ceremony, the certified marriage certificate. It records the issuing state and county, both applicants, eligibility (age and consent, prior marriages, relationship, proxy), the license issuance and fee, and the ceremony (officiant, witnesses, return of the signed license). It classifies the application as **ready-to-apply**, **incomplete**, or **not-eligible**, works out the earliest permitted ceremony date and the license expiry, and raises prioritized flags (`F-USMLA-001` to `F-USMLA-024`).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-states-marriage-license-application-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
