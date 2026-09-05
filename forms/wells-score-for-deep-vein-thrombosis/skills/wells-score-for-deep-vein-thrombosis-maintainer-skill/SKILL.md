---
name: wells-score-for-deep-vein-thrombosis-maintainer-skill
description: "Implementation workflow for maintaining and extending the Wells Score for Deep Vein Thrombosis (DVT) form (forms/wells-score-for-deep-vein-thrombosis/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Wells Score for Deep Vein Thrombosis (DVT) — Maintainer Skill

Implementation-facing companion to `wells-score-for-deep-vein-thrombosis-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/wells-score-for-deep-vein-thrombosis/` contains:

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

- **Input shape:** `WellsDvtAssessment` TypeScript type — the nine criterion
  inputs plus the alternative-diagnosis adjustment, context, and identification
  fields.
- **Output shape:**
  ```ts
  gradeWellsDvt(data: WellsDvtAssessment): {
    criterionPoints: Record<string, 0 | 1 | -2>;
    wellsScore: number;                       // -2..9
    twoLevelBand: 'likely' | 'unlikely';
    threeLevelBand: 'low' | 'moderate' | 'high';
    recommendedInvestigation: 'proximal-leg-vein-ultrasound' | 'd-dimer';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each of the nine criteria contributes 0 or 1 when
  its value is `yes`; the alternative-diagnosis input subtracts 2. See spec §4.
  - `wellsScore = (sum of +1 for each 'yes' criterion) − (alternativeDiagnosisAsLikely == 'yes' ? 2 : 0)` → range −2..9
  - `twoLevelBand = wellsScore >= 2 ? 'likely' : 'unlikely'`
  - `threeLevelBand = wellsScore >= 3 ? 'high' : wellsScore >= 1 ? 'moderate' : 'low'`
  - `recommendedInvestigation = twoLevelBand == 'likely' ? 'proximal-leg-vein-ultrasound' : 'd-dimer'`
  - A blank criterion contributes 0 points and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `wells-dvt-rules.ts`,
  `wells-dvt-grader.ts`, `flagged-issues.ts`.
- **Tests:** `wells-dvt-grader.test.ts`, `wells-dvt-rules.test.ts` — cover the
  two-level boundary (1 vs 2), three-level boundaries (0/1, 2/3), the `−2`
  adjustment including a negative total, and the −2 / 9 extremes.

## Verify

```sh
bin/test-form wells-score-for-deep-vein-thrombosis
bin/test-sql-apply wells-score-for-deep-vein-thrombosis
bin/test-personas wells-score-for-deep-vein-thrombosis
bin/test-e2e --html wells-score-for-deep-vein-thrombosis
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
