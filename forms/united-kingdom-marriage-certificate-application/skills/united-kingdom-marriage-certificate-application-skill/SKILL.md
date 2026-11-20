---
name: united-kingdom-marriage-certificate-application-skill
description: "Explains what the United Kingdom Marriage Certificate Application form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United Kingdom Marriage Certificate Application

A completeness and validity check for giving notice of marriage or civil partnership in England and Wales and ordering a marriage certificate from the General Register Office (GRO). A single continuous page collects the notice, the ceremony, each party's identity, residence, previous-relationship and immigration evidence, whether the parties are closely related, and the certificate order. The engine classifies the application as **ready to submit**, **incomplete**, **needs evidence or correction**, or **ineligible**, computes the permitted ceremony window, and raises flagged issues. It gives no legal advice; the register office decides each notice.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-kingdom-marriage-certificate-application-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
