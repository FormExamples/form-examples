---
name: nuclear-medicine-test-request-skill
description: "Explains what the Nuclear Medicine Test Request form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Nuclear Medicine Test Request

A UK NHS–aligned **nuclear medicine (radionuclide imaging) request (referral)** that a clinician completes to request a radionuclide study — for example a bone scan, myocardial perfusion scan, V/Q lung scan, thyroid uptake, renal DMSA / MAG3, gallium / octreotide, white-cell, or sentinel-node study. It records the requested scan, the clinical indication and specific question, relevant history, and the radiation-safety governance (pregnancy and breastfeeding status, renal function, recent radionuclide exposure, weight) — then computes a **four-axis grading** (appropriateness, preparation & radiation safety, request completeness, and triage priority) plus a set of safety-critical flags. The output is a vetting report that supports the nuclear-medicine department's justification, triage, and booking decisions.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `nuclear-medicine-test-request-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
