---
name: glasgow-coma-scale-skill
description: "Explains what the Glasgow Coma Scale form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Glasgow Coma Scale

A structured, clinician-driven assessment of impaired consciousness. The observer scores three independent responses — **Eye opening (E, 1–4)**, **Verbal response (V, 1–5)**, and **Motor response (M, 1–6)** — and the engine computes the **total GCS (3–15)**, the **E/V/M breakdown**, and a **severity band** (mild / moderate / severe). It supports a **"not testable" (NT)** result per component (for example a swollen-shut eye, an intubated airway, or a paralysed limb) and, as a secondary instrument, the pupil-augmented **GCS-Pupils (GCS-P)** score.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `glasgow-coma-scale-maintainer-skill` instead.

## Scoring engine

Pure, deterministic function over the assessment. No side effects, no I/O.

- **Input shape:**
  ```ts
  interface GcsAssessment {
    // context
    assessedAt: string | null;        // ISO 8601 datetime
    assessorName: string;             // '' if unanswered
    assessorRole: string;             // '' if unanswered
    setting: string;                  // 'ed' | 'neuro' | 'critical-care' | 'pre-hospital' | ''
    // components — score is null when not testable; the NT flag records why
    eyeScore: number | null;          // 1..4
    eyeNotTestable: boolean;
    verbalScore: number | null;       // 1..5
    verbalNotTestable: boolean;
    motorScore: number | null;        // 1..6
    motorNotTestable: boolean;
    // confounders (each may justify an NT)
    intubated: boolean;
    sedated: boolean;
    paralysed: boolean;
    // pupils — for GCS-P
    leftPupilReactive: boolean | null;
    rightPupilReactive: boolean | null;
    // trend
    previousTotal: number | null;     // 3..15
    previousMotorScore: number | null;// 1..6
  }
  ```
- **Output shape:**
  ```ts
  calculateGcs(data: GcsAssessment): {
    eyeScore: number | null;          // 1..4
    verbalScore: number | null;       // 1..5
    motorScore: number | null;        // 1..6
    total: number | null;             // 3..15; null if any component NT
    breakdown: string;                // e.g. "E3 V4 M5" or "E3 V-NT M5"
    totalDisplay: string;             // e.g. "12" or "9T" (intubated verbal)
    severityBand: 'mild' | 'moderate' | 'severe' | null;
    pupilReactivityScore: number | null; // 0..2 (pupils unreactive to light)
    gcsP: number | null;              // 1..15 = total − PRS; null if undefined
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:**
  1. Resolve each component score, or `null` when its NT flag is set.
  2. `total = eye + verbal + motor` only when all three are testable; otherwise
     `null` and `severityBand = null`.
  3. Band the defined total: 13–15 `mild`, 9–12 `moderate`, 3–8 `severe`.
  4. `pupilReactivityScore` = count of pupils unreactive to light (0–2), when
     both pupils are examined.
  5. `gcsP = total − pupilReactivityScore` when both `total` and PRS are defined.
  6. Evaluate rules (§ flagged issues) and collect fired rules and flags.
- **Engine files:** `types.ts`, `gcs-rules.ts`, `gcs-grader.ts`,
  `flagged-issues.ts`, `utils.ts`.
- **Tests:** `gcs-grader.test.ts`, `flagged-issues.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
