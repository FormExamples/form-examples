---
name: caprini-venous-thromboembolism-risk-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Caprini Venous Thromboembolism Risk Assessment form (forms/caprini-venous-thromboembolism-risk-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Caprini Venous Thromboembolism Risk Assessment — Maintainer Skill

Implementation-facing companion to `caprini-venous-thromboembolism-risk-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/caprini-venous-thromboembolism-risk-assessment/` contains:

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

- **Input shape:** `CapriniAssessment` TypeScript type — the age band, the
  yes/no risk-factor inputs (1-, 2-, 3-, and 5-point groups), the bleeding-risk
  input, plus context and identification fields.
- **Output shape:**
  ```ts
  gradeCaprini(data: CapriniAssessment): {
    factorPoints: FactorPoints[];   // each fired factor with its weight
    capriniScore: number;           // 0..40+
    riskBand: 'very-low' | 'low' | 'moderate' | 'high';
    recommendedProphylaxis:
      'early-ambulation' | 'mechanical'
      | 'pharmacological-or-mechanical' | 'pharmacological-plus-mechanical';
    firedFactors: FiredFactor[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — sum the age-band weight plus the fixed weight of
  every fired factor; the total maps to the risk band (0–1 → very-low, 2 → low,
  3–4 → moderate, ≥ 5 → high) and prophylaxis recommendation. See spec §4. A
  high bleeding risk downgrades any pharmacological recommendation to mechanical
  and raises a contraindication flag. A missing input contributes 0 points and
  raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `caprini-rules.ts`,
  `caprini-grader.ts`, `flagged-issues.ts`.
- **Tests:** `caprini-grader.test.ts`, `caprini-rules.test.ts` — cover each band
  boundary (score 1/2, 2/3, 4/5), the age-band weights, the bleeding-risk
  downgrade, and a representative fired-factor mix.

## Verify

```sh
bin/test-form caprini-venous-thromboembolism-risk-assessment
bin/test-sql-apply caprini-venous-thromboembolism-risk-assessment
bin/test-personas caprini-venous-thromboembolism-risk-assessment
bin/test-e2e --html caprini-venous-thromboembolism-risk-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
