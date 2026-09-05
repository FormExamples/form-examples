---
name: partogram-skill
description: "Explains what the Partogram (Partograph) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Partogram (Partograph)

A graphical record of the progress of labour. The partogram plots a **timed series of observations** — cervical dilatation, descent of the fetal head, uterine contractions, fetal heart rate, amniotic fluid (liquor) and moulding, maternal vital signs, urine, and drugs / oxytocin — against elapsed time in active labour. Cervical dilatation is charted against two reference lines: an **alert line** (expected progress of about 1 cm per hour from the start of the active phase at 4 cm) and an **action line** drawn four hours to the right of it. The engine **computes a labour-progress classification and raises flags**; it does not produce a validated numeric score.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `partogram-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
