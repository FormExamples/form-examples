---
name: wells-score-for-pulmonary-embolism-maintainer-skill
description: "Implementation workflow for maintaining and extending the Wells Score for Pulmonary Embolism form (forms/wells-score-for-pulmonary-embolism/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Wells Score for Pulmonary Embolism — Maintainer Skill

Implementation-facing companion to `wells-score-for-pulmonary-embolism-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/wells-score-for-pulmonary-embolism/` contains:

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

- **Input shape:** `WellsPeAssessment` TypeScript type — the seven criterion
  inputs plus context, identification, and haemodynamic-status fields.
- **Output shape:**
  ```ts
  gradeWellsPe(data: WellsPeAssessment): {
    dvtSignsPoints: 0 | 3;
    peMostLikelyPoints: 0 | 3;
    heartRatePoints: 0 | 1.5;
    immobilisationSurgeryPoints: 0 | 1.5;
    previousDvtPePoints: 0 | 1.5;
    haemoptysisPoints: 0 | 1;
    malignancyPoints: 0 | 1;
    wellsScore: number;            // 0 .. 12.5
    twoLevelBand: 'unlikely' | 'likely';
    threeLevelBand: 'low' | 'moderate' | 'high';
    recommendedPathway: 'd-dimer' | 'ctpa';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive weighted — each present criterion contributes its
  points; the total 0–12.5 determines the bands. See spec §4.
  - `dvtSigns == 'yes'` → 3
  - `peMostLikely == 'yes'` → 3
  - `heartRate > 100` → 1.5
  - `immobilisationSurgery == 'yes'` → 1.5
  - `previousDvtPe == 'yes'` → 1.5
  - `haemoptysis == 'yes'` → 1
  - `malignancy == 'yes'` → 1
  - `twoLevelBand = wellsScore > 4 ? 'likely' : 'unlikely'`
  - `recommendedPathway = twoLevelBand == 'likely' ? 'ctpa' : 'd-dimer'`
  - `threeLevelBand = wellsScore < 2 ? 'low' : wellsScore <= 6 ? 'moderate' : 'high'`
  - A missing numeric heart rate contributes 0 points and raises a
    data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `wells-pe-rules.ts`,
  `wells-pe-grader.ts`, `flagged-issues.ts`.
- **Tests:** `wells-pe-grader.test.ts`, `wells-pe-rules.test.ts` — cover each
  threshold boundary (heart rate 100/101, two-level 4/4.5, three-level 1.5/2 and
  6/6.5) and the 0 and 12.5 extremes.

## Verify

```sh
bin/test-form wells-score-for-pulmonary-embolism
bin/test-sql-apply wells-score-for-pulmonary-embolism
bin/test-personas wells-score-for-pulmonary-embolism
bin/test-e2e --html wells-score-for-pulmonary-embolism
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
