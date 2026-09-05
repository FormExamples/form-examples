---
name: medical-certificate-of-cause-of-death-skill
description: "Explains what the Medical Certificate of Cause of Death (MCCD) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Certificate of Cause of Death (MCCD)

A statutory documentation instrument used in the United Kingdom to record the cause of death of a person for the purpose of death registration. The certifying doctor (attending practitioner) records the deceased's details, the date and place of death, and the **cause-of-death structure** — Part I (the disease or condition directly leading to death, together with the antecedent and underlying conditions that gave rise to it) and Part II (other significant conditions contributing to the death but not related to the disease or condition causing it). Each condition carries an approximate interval between onset and death.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-certificate-of-cause-of-death-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
