---
name: uk-nhs-digital-technology-assessment-criteria-skill
description: "Explains what the UK NHS Digital Technology Assessment Criteria (DTAC) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# UK NHS Digital Technology Assessment Criteria (DTAC)

A UK NHS–aligned assessment of a digital health technology against the NHS England **Digital Technology Assessment Criteria (DTAC)**. A commissioner, procurement lead or assurance team records, for each of 47 criteria in seven sections (company information, value proposition, clinical safety, data protection, technical security, interoperability, usability and accessibility), whether the supplier's evidence shows the criterion is **met**, **partially met**, **not met** or **not applicable**. The engine computes a per-section result, an overall outcome (**meets**, **conditional**, **does-not-meet** or **incomplete**) and a list of flagged issues, and the wizard produces a signed assessment report.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `uk-nhs-digital-technology-assessment-criteria-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- No `examples/personas.json` yet for this form — see `form-examples-maintainer-skill` for how personas are authored.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
