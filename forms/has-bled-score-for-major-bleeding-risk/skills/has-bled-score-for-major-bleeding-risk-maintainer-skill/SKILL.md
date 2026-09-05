---
name: has-bled-score-for-major-bleeding-risk-maintainer-skill
description: "Implementation workflow for maintaining and extending the HAS-BLED Score for Major Bleeding Risk form (forms/has-bled-score-for-major-bleeding-risk/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# HAS-BLED Score for Major Bleeding Risk — Maintainer Skill

Implementation-facing companion to `has-bled-score-for-major-bleeding-risk-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/has-bled-score-for-major-bleeding-risk/` contains:

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |

Generated artefacts (`xml`, `fhir`, `protobuf`, `openapi`, the Loco setup script, `CHANGELOG.md`, `examples/assessment.json`) are never hand-edited — regenerate them instead; see the tool catalogue in [`/AGENTS.md`](../../../../AGENTS.md).

## Scoring engine

- **Input shape:** `HasBledAssessment` TypeScript type — the nine criterion
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeHasBled(data: HasBledAssessment): {
    hypertensionPoint: 0 | 1;
    renalPoint: 0 | 1;
    liverPoint: 0 | 1;
    strokePoint: 0 | 1;
    bleedingPoint: 0 | 1;
    labileInrPoint: 0 | 1;
    elderlyPoint: 0 | 1;
    drugsPoint: 0 | 1;
    alcoholPoint: 0 | 1;
    hasBledScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    riskBand: 'low' | 'moderate' | 'high';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each criterion contributes 0 or 1; the total 0–9
  determines the risk band (`0` → `low`, `1–2` → `moderate`, `≥ 3` → `high`). See
  spec §4. Elderly and alcohol points derive from numeric inputs; a missing
  numeric input contributes 0 and raises a data-completeness flag.
  - hypertension uncontrolled (SBP > 160) → 1
  - abnormal renal function → 1
  - abnormal liver function → 1
  - stroke history → 1
  - bleeding history / predisposition → 1
  - labile INR (TTR < 60%) → 1
  - age > 65 → 1
  - antiplatelets / NSAIDs → 1
  - alcohol ≥ 8 units/week → 1
- **Engine files:** `types.ts`, `utils.ts`, `hasbled-rules.ts`,
  `hasbled-grader.ts`, `flagged-issues.ts`.
- **Tests:** `hasbled-grader.test.ts`, `hasbled-rules.test.ts` — cover the age
  boundary (65/66), the alcohol boundary (7/8 units), the risk-band boundaries
  (0, 2/3), and the minimum and maximum totals (0 and 9).

## Verify

```sh
bin/test-form has-bled-score-for-major-bleeding-risk
bin/test-sql-apply has-bled-score-for-major-bleeding-risk
bin/test-personas has-bled-score-for-major-bleeding-risk
bin/test-e2e --html has-bled-score-for-major-bleeding-risk
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
