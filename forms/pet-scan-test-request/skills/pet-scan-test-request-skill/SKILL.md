---
name: pet-scan-test-request-skill
description: "Explains what the PET Scan Test Request form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# PET Scan Test Request

A UK NHS–aligned **PET-CT (positron emission tomography) scan request (referral)** that a clinician completes to request a PET-CT examination, most commonly an oncology FDG-PET-CT for cancer staging, restaging, or treatment-response assessment. It records the requested tracer and scan type, the primary indication and specific clinical question, the primary tumour site and relevant history, the FDG patient-preparation and safety data (diabetes, blood glucose control, pregnancy, breastfeeding, renal function), the IR(ME)R justification, and the requested urgency — then computes a **four-axis grading** (appropriateness, preparation safety and radiation dose, request completeness, and triage priority) plus a set of safety-critical flags. The output is a vetting report that supports the nuclear-medicine department's triage and booking decision.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `pet-scan-test-request-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
