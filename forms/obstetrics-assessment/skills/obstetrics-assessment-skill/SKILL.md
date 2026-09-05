---
name: obstetrics-assessment-skill
description: "Explains what the Obstetrics Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Obstetrics Assessment

Antenatal obstetric assessment aligned with NICE NG201, stratifying pregnancies into low, moderate, and high risk to allocate care pathway (midwifery-led, obstetrician-led, or multidisciplinary) and to schedule surveillance, screening, and birth planning.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `obstetrics-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: NICE NG201 Antenatal Risk Assessment
- **Range**: Low Risk / Moderate Risk / High Risk
- **Categories**:
  - Low Risk: midwifery-led care
  - Moderate Risk: obstetric input at key milestones
  - High Risk: consultant-led / multidisciplinary care
- **Engine files**: `types.ts`, `antenatal-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `antenatal-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
