---
name: issue-tracker-maintainer-skill
description: "Implementation workflow for maintaining and extending the Issue tracker form (forms/issue-tracker/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Issue tracker — Maintainer Skill

Implementation-facing companion to `issue-tracker-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/issue-tracker/` contains:

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

- **Input shape:** `IssueTrackerAssessment` TypeScript type containing the
  nine SOAP-style sub-types plus reporter and metadata fields.
- **Output shape:**
  ```ts
  gradeIssue(data: IssueTrackerAssessment): {
    scoreByPriorityRank: number;        // 1, 2, 3, ...
    scoreBySeverityOfImpact: 1 | 2 | 3 | 4 | 5;
    scoreByMagnitudeOfDamage: number;   // 1..10
    scoreByHarmGrade: 0 | 1 | 2 | 3 | 4;
    scoreByFailureCondition: 'A' | 'B' | 'C' | 'D' | 'E';
    scoreByMoscowRequirement: 1 | 2 | 3 | 4;
    scoreByFrequencyPercent: number;    // 0..100
    compositePriority: 'low' | 'moderate' | 'high' | 'critical';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst single-dimension finding sets the
  composite. The composite is `low` only when *every* score is in its
  low band.
- **Engine files:** `types.ts`, `utils.ts`, `priority-rules.ts`,
  `severity-rules.ts`, `magnitude-rules.ts`, `harm-rules.ts`,
  `failure-rules.ts`, `moscow-rules.ts`, `frequency-rules.ts`,
  `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, plus one per scoring rule file.

## Verify

```sh
bin/test-form issue-tracker
bin/test-sql-apply issue-tracker
bin/test-personas issue-tracker
bin/test-e2e --html issue-tracker
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
