---
name: perioperative-optimization-skill
description: "Explains what the Perioperative Optimization form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Perioperative Optimization

A UK NHS–aligned **perioperative optimization and prehabilitation** intake: the screening questionnaire a surgical or anaesthetic team uses to identify **reversible** health problems before surgery, decide what can be treated in the time available, and build a personalized prehabilitation plan.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `perioperative-optimization-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `PerioperativeOptimization`, one section per wizard step.
- **Output shape:**

  ```ts
  calculateOptimization(data: PerioperativeOptimization): {
    weeksToSurgery: number | null;
    domains: DomainResult[];          // one per domain, in DOMAIN_ORDER
    computedReadiness: 'ready' | 'optimization-in-progress'
                     | 'optimization-required' | 'defer-surgery';
    finalReadiness: 'ready' | 'optimization-in-progress'
                  | 'optimization-required' | 'defer-surgery';
    overrideReason: string;
    gateDecision: GateDecision;
    mustScore: number | null;         // 0..6
    auditCScore: number | null;       // 0..12
    stopBangScore: number | null;     // 0..8
    dasiScore: number | null;
    friedPhenotypeScore: number | null;  // 0..5
    friedFrailtyCategory: 'robust' | 'pre-frail' | 'frail' | '';
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }

  interface DomainResult {
    domain: DomainKey;
    status: 'optimized' | 'in-progress' | 'action-required'
          | 'insufficient-time' | 'not-applicable';
    triggered: boolean;
    leadTimeWeeks: number;
    weeksShortfall: number | null;    // positive when time is short
    finding: string;
    intervention: string;
  }
  ```

- **Algorithm:** per-domain trigger → gate on time → max-grade composite. The
  worst domain sets the readiness band. Safety flags fire independently.
- **Engine files (HTML):** `js/types.js`, `js/domain-rules.js` (also exports
  `computeFriedPhenotypeScore()`), `js/gating.js`, `js/composite-grader.js`,
  `js/flagged-issues.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `domain-rules.ts`,
  `gating.ts`, `flagged-issues.ts`, `grader.ts`), with `grader.test.ts`.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()`. Both the
  assessment date and the planned surgery date come from the data, so
  `weeksToSurgery` is derived from recorded values and the function is
  deterministic.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
