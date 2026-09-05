---
name: arc42-skill
description: "Explains what the arc42 form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# arc42

A structured documentation wizard for [arc42](https://arc42.org/overview), the pragmatic template for software architecture communication. One form instance captures one architecture's documentation across arc42's twelve canonical sections; the form computes a per-section completeness grade, a composite **maturity band** (Draft / Reviewable / Ready / Mature), and a set of fired flags for architecturally critical omissions. Output is a signed arc42 document in HTML, PDF, AsciiDoc, FHIR R5 Bundle, and XML.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `arc42-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `Arc42Documentation` TypeScript type containing prose fields
  directly on the top-level object plus child arrays:
  `businessGoals`, `qualityGoals`, `stakeholders`, `constraintItems`,
  `contextPartners`, `technologyDecisions`, `buildingBlocks`,
  `runtimeScenarios`, `deploymentNodes`, `crosscuttingConcepts`,
  `architecturalDecisions`, `qualityScenarios`, `riskItems`, `glossaryTerms`.

- **Output shape:**
  ```ts
  calculateMaturity(d: Arc42Documentation): {
    computedMaturity: 'Draft' | 'Reviewable' | 'Ready' | 'Mature';
    finalMaturity: 'Draft' | 'Reviewable' | 'Ready' | 'Mature';
    completenessBySection: Record<1|2|3|4|5|6|7|8|9|10|11|12,
                                  'empty' | 'partial' | 'complete'>;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```

- **Algorithm (max-grade):**
  1. Evaluate per-section completeness (`empty` / `partial` / `complete`) using
     the thresholds in `doc/completeness-rules.md`.
  2. Derive `computedMaturity` from the lowest completeness across all 12
     sections, checked against the four band drivers in `doc/maturity-rules.md`.
  3. Fire independent flags (high / medium / low priority) from
     `doc/maturity-rules.md`; flags do not alter the maturity calculation.
  4. Apply any author override from step 12 to produce `finalMaturity`.
  5. Store both `computedMaturity` and `finalMaturity`.

- **Engine files:**
  - `src/lib/grading/types.ts` — `Arc42Documentation` + sub-types
  - `src/lib/grading/utils.ts` — cardinality + completeness helpers
  - `src/lib/grading/completeness-rules.ts` — per-section completeness rules
  - `src/lib/grading/maturity-grader.ts` — `calculateMaturity()` pure function
  - `src/lib/grading/flagged-issues.ts` — `detectFlags()`
  - `src/lib/grading/completeness-rules.test.ts`
  - `src/lib/grading/maturity-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
