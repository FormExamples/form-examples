---
name: child-pugh-score-maintainer-skill
description: "Implementation workflow for maintaining and extending the Child-Pugh Score (Child-Turcotte-Pugh) form (forms/child-pugh-score/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Child-Pugh Score (Child-Turcotte-Pugh) — Maintainer Skill

Implementation-facing companion to `child-pugh-score-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/child-pugh-score/` contains:

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

- **Input shape:** `ChildPughAssessment` TypeScript type — the five parameter
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeChildPugh(data: ChildPughAssessment): {
    bilirubinPoint: 1 | 2 | 3;
    albuminPoint: 1 | 2 | 3;
    coagulationPoint: 1 | 2 | 3;
    ascitesPoint: 1 | 2 | 3;
    encephalopathyPoint: 1 | 2 | 3;
    childPughScore: number;              // 5..15
    childPughClass: 'A' | 'B' | 'C';
    oneYearSurvival: string;             // banded estimate
    twoYearSurvival: string;             // banded estimate
    surgicalRisk: 'low' | 'moderate' | 'high';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each of the five parameters maps to 1, 2, or 3 points
  against the thresholds in spec §4; the total 5-15 bands into class A/B/C. Each
  class carries fixed survival and surgical-risk estimates. See spec §4. A
  missing parameter cannot be scored, so the engine treats an incomplete
  parameter set as a partial score and raises a data-completeness flag.
  - bilirubin: `< 34` → 1, `34-50` → 2, `> 50` µmol/L → 3
  - albumin: `> 35` → 1, `28-35` → 2, `< 28` g/L → 3
  - coagulation (INR): `< 1.7` → 1, `1.7-2.3` → 2, `> 2.3` → 3
  - ascites: none → 1, mild → 2, moderate-to-severe → 3
  - encephalopathy: none → 1, grade 1-2 → 2, grade 3-4 → 3
- **Engine files:** `types.ts`, `utils.ts`, `child-pugh-rules.ts`,
  `child-pugh-grader.ts`, `flagged-issues.ts`.
- **Tests:** `child-pugh-grader.test.ts`, `child-pugh-rules.test.ts` — cover each
  threshold boundary (bilirubin 34/50, albumin 28/35, INR 1.7/2.3), each ordinal
  grade, and every class boundary (6/7, 9/10).

## Verify

```sh
bin/test-form child-pugh-score
bin/test-sql-apply child-pugh-score
bin/test-personas child-pugh-score
bin/test-e2e --html child-pugh-score
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
