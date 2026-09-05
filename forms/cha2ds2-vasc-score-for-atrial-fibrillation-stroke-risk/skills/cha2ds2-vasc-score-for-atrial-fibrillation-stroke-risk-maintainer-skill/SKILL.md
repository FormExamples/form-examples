---
name: cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk-maintainer-skill
description: "Implementation workflow for maintaining and extending the CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk form (forms/cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk — Maintainer Skill

Implementation-facing companion to `cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk/` contains:

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

- **Input shape:** `Cha2ds2VascAssessment` TypeScript type — the eight criterion
  inputs (age and sex drive the age and sex-category points) plus context and
  identification fields.
- **Output shape:**
  ```ts
  gradeCha2ds2Vasc(data: Cha2ds2VascAssessment): {
    congestiveHeartFailurePoint: 0 | 1;
    hypertensionPoint: 0 | 1;
    agePoint: 0 | 1 | 2;
    diabetesPoint: 0 | 1;
    strokePoint: 0 | 2;
    vascularDiseasePoint: 0 | 1;
    sexPoint: 0 | 1;
    cha2ds2VascScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    riskBand: 'low' | 'intermediate' | 'high';
    annualStrokeRatePercent: number;
    anticoagulationRecommendation: 'none' | 'consider' | 'recommended';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive with weighted and mutually-exclusive terms; see spec §4.
  - CHF / hypertension / diabetes / vascular disease → 1 each when present
  - prior stroke / TIA / thromboembolism → 2 when present
  - age ≥ 75 → 2; age 65–74 → 1; age < 75 and ≥ 65 handled as a single band
    (never both)
  - female sex → 1
  - total 0–9 → risk band, with the edge cases: male total 0 = low, female total 1
    (sex point only) = low, male total 1 = intermediate, otherwise high
  - `annualStrokeRatePercent` is a fixed lookup indexed by total score
    (0→0.2, 1→1.3, 2→2.2, 3→3.2, 4→4.0, 5→6.7, 6→9.8, 7→9.6, 8→6.7, 9→15.2)
  - A missing enum input is treated as absent (`no`) and raises a
    data-completeness flag; missing `ageYears` scores 0 for age and flags.
- **Engine files:** `types.ts`, `utils.ts`, `cha2ds2vasc-rules.ts`,
  `cha2ds2vasc-grader.ts`, `flagged-issues.ts`.
- **Tests:** `cha2ds2vasc-grader.test.ts`, `cha2ds2vasc-rules.test.ts` — cover the
  age boundaries (64/65/74/75), mutually-exclusive age bands, the female-total-1
  low-risk case, the male-total-1 intermediate case, and every total 0–9 against
  the stroke-rate lookup.

## Verify

```sh
bin/test-form cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk
bin/test-sql-apply cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk
bin/test-personas cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk
bin/test-e2e --html cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
