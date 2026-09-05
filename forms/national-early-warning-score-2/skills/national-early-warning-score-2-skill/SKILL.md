---
name: national-early-warning-score-2-skill
description: "Explains what the National Early Warning Score 2 (NEWS2) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# National Early Warning Score 2 (NEWS2)

A UK NHS–aligned implementation of the **National Early Warning Score 2 (NEWS2)**, the standardized track-and-trigger early warning system published by the Royal College of Physicians (RCP) in December 2017. The form records six routinely measured physiological parameters at the bedside, scores each against the published NEWS2 allocation, aggregates them into a total score of **0 to 20+**, and returns the resulting **clinical-risk band** together with the RCP's recommended monitoring frequency and clinical-response (escalation) actions.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `national-early-warning-score-2-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `News2Assessment` — patient identity, assessment context
  (including `spo2Scale`), and the six observations.
  ```ts
  type Acvpu = 'alert' | 'confusion' | 'voice' | 'pain' | 'unresponsive';
  interface News2Assessment {
    spo2Scale: 'scale1' | 'scale2';
    respirationRate: number | null; // breaths/min
    spo2: number | null;            // %
    airOrOxygen: 'air' | 'oxygen' | '';
    systolicBp: number | null;      // mmHg
    pulse: number | null;           // beats/min
    consciousness: Acvpu | '';
    temperature: number | null;     // °C
  }
  ```
- **Output shape:**
  ```ts
  gradeNews2(data: News2Assessment): {
    subscores: {
      respirationRate: 0 | 1 | 2 | 3 | null;
      spo2: 0 | 1 | 2 | 3 | null;
      airOrOxygen: 0 | 2;
      systolicBp: 0 | 1 | 2 | 3 | null;
      pulse: 0 | 1 | 2 | 3 | null;
      consciousness: 0 | 3 | null;
      temperature: 0 | 1 | 2 | 3 | null;
    };
    aggregate: number;                // 0..20+
    redScore: boolean;                // any single parameter == 3
    riskBand: 'low' | 'low-medium' | 'medium' | 'high';
    monitoringFrequency: string;      // e.g. '12-hourly', '1-hourly', 'continuous'
    recommendation: string;
    firedRules: FiredRule[];
    flags: Flag[];
  };
  ```
- **Algorithm:** score each parameter to 0–3 via the published bands; `spo2` uses
  Scale 1 or Scale 2 per `spo2Scale`, with Scale 2 also depending on
  `airOrOxygen`. `airOrOxygen` adds 2 for `oxygen`. `consciousness` scores 3 for
  any value other than `alert`. `aggregate` is the sum of all subscores.
  `redScore` is true when any single parameter subscore is 3. The `riskBand` is
  the **worst** of the aggregate band (0 / 1–4 / 5–6 / ≥7) and the red-score band
  (max-severity), which drives `monitoringFrequency` and `recommendation`.
- **Engine files:** `types.ts`, `utils.ts`, `news2-rules.ts` (per-parameter band
  tables + Scale 1 / Scale 2 SpO₂ logic), `news2-grader.ts` (aggregate + band +
  monitoring/response), `flagged-issues.ts` (safety flags).
- **Tests:** `news2-grader.test.ts`, `news2-rules.test.ts` — cover the published
  RCP worked examples for both SpO₂ scales, boundary values on every band, and
  the red-score escalation.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
