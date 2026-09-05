---
name: eye-prescription-skill
description: "Explains what the Eye Prescription form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Eye Prescription

A UK General Optical Council (GOC) aligned **spectacle prescription** as issued by a registered optometrist or dispensing optician following a sight test. Captures refractive correction for each eye (sphere, cylinder, axis, addition, prism, base), pupillary distance, visual acuity, optional ocular health findings, and lens recommendations. Computes a per-eye **refractive classification** (emmetropia / myopia / hyperopia / astigmatism, each by severity), a composite **prescription complexity** (simple / moderate / complex), and a set of **safety flags** (high myopia, high astigmatism, significant anisometropia, prism present, presbyopia, expired prescription, paediatric, ocular pathology). Output is a signed prescription document with validity dates suitable for handing to a lens dispenser, exporting as a FHIR R5 `VisionPrescription` resource, or archiving as XML.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `eye-prescription-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `EyePrescription` TypeScript type with `prescriber`,
  `patient`, `examination`, two `EyeRefraction` (right and left), one
  `VisualAcuity`, one `PupillaryDistance`, one `LensRecommendation`, optional
  `OcularHealthFinding`.
- **Output shape:**
  ```ts
  classifyPrescription(data: EyePrescription): {
    rightEyeClassification: RefractiveClass[]; // may include both sphere class and astigmatism class
    leftEyeClassification: RefractiveClass[];
    presbyopiaPresent: boolean;
    anisometropiaDiopters: number;            // |sphereOD - sphereOS|
    complexity: 'simple' | 'moderate' | 'complex';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** per-eye classification is a band lookup on sphere and a band
  lookup on cylinder; complexity uses the worst-of rule across both eyes.
- **Engine files:** `types.ts`, `utils.ts`, `refractive-rules.ts`,
  `complexity-grader.ts`, `flagged-issues.ts`.
- **Tests:** `complexity-grader.test.ts`, `refractive-rules.test.ts`,
  `flagged-issues.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
