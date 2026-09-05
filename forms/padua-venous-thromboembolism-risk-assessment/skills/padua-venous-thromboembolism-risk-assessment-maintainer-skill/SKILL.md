---
name: padua-venous-thromboembolism-risk-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Padua Venous Thromboembolism Risk Assessment (Padua Prediction Score) form (forms/padua-venous-thromboembolism-risk-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Padua Venous Thromboembolism Risk Assessment (Padua Prediction Score) — Maintainer Skill

Implementation-facing companion to `padua-venous-thromboembolism-risk-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/padua-venous-thromboembolism-risk-assessment/` contains:

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

- **Input shape:** `PaduaAssessment` TypeScript type — the eleven risk-factor
  inputs plus the bleeding-risk fields and context and identification fields.
- **Output shape:**
  ```ts
  gradePadua(data: PaduaAssessment): {
    factorPoints: Record<string, number>; // per-factor contribution
    paduaScore: number;                   // 0..20
    riskBand: 'low' | 'high';
    firedFactors: FiredFactor[];
    flaggedIssues: FlaggedIssue[];
    prophylaxisRecommendation: 'pharmacological' | 'mechanical' | 'none';
  }
  ```
- **Algorithm:** additive weighted — each factor contributes its weight when
  present; the total 0–20 determines the risk band (`≥ 4` → `high`). See spec
  §4. A missing numeric input (`ageYears`, `bodyMassIndex`) contributes 0 points
  and raises a data-completeness flag.
  - active cancer (3), previous VTE (3), reduced mobility ≥ 3 days (3), known
    thrombophilia (3)
  - recent trauma/surgery ≤ 1 month (2)
  - age ≥ 70 (1), heart/respiratory failure (1), acute MI or ischaemic stroke
    (1), acute infection/rheumatological (1), obesity BMI ≥ 30 (1), ongoing
    hormonal treatment (1)
- **Engine files:** `types.ts`, `utils.ts`, `padua-rules.ts`,
  `padua-grader.ts`, `flagged-issues.ts`.
- **Tests:** `padua-grader.test.ts`, `padua-rules.test.ts` — cover each factor's
  contribution, the age 69/70 and BMI 29/30 boundaries, the score 3/4 band
  boundary, and the bleeding-risk gating of the recommendation.

## Verify

```sh
bin/test-form padua-venous-thromboembolism-risk-assessment
bin/test-sql-apply padua-venous-thromboembolism-risk-assessment
bin/test-personas padua-venous-thromboembolism-risk-assessment
bin/test-e2e --html padua-venous-thromboembolism-risk-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
