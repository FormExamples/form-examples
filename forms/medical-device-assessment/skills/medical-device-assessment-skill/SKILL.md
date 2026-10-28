---
name: medical-device-assessment-skill
description: "Explains what the Medical Device Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Device Assessment

A single-page, step-by-step questionnaire that assesses a medical device against the EU MDR 2017/745 Annex VIII classification rules (mirrored by the UK Medical Devices Regulations 2002). The assessor describes the device; the engine computes the risk class (I, IIa, IIb, III), the conformity-assessment route, and flags regulatory-readiness gaps.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-device-assessment-maintainer-skill` instead.

## Scoring engine

Pure function: assessment state in, `{ computedClass, classSuffix,
conformityRoute, firedRules, flags, readiness }` out. Highest class over all
fired rules wins. Rule table is in `index.md`. Never hand-edit generated
artefacts (`xml/`, `fhir/`, `protobuf/`, `openapi/`, `back-end-with-loco-setup`).

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
