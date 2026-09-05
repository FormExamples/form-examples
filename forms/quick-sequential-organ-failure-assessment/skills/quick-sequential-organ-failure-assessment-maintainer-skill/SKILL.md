---
name: quick-sequential-organ-failure-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Quick Sequential Organ Failure Assessment (qSOFA) form (forms/quick-sequential-organ-failure-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Quick Sequential Organ Failure Assessment (qSOFA) — Maintainer Skill

Implementation-facing companion to `quick-sequential-organ-failure-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/quick-sequential-organ-failure-assessment/` contains:

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

- **Input shape:** `QsofaAssessment` TypeScript type — the three criterion
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeQsofa(data: QsofaAssessment): {
    respiratoryRatePoint: 0 | 1;
    mentationPoint: 0 | 1;
    systolicBloodPressurePoint: 0 | 1;
    qsofaScore: 0 | 1 | 2 | 3;
    riskBand: 'lower' | 'higher';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each criterion contributes 0 or 1; the total 0–3
  determines the risk band (`≥ 2` → `higher`). See spec §4. A missing numeric
  input contributes 0 points and raises a data-completeness flag.
  - respiratory rate ≥ 22 → 1
  - GCS < 15 (or "mentation altered" = yes) → 1
  - systolic BP ≤ 100 → 1
- **Engine files:** `types.ts`, `utils.ts`, `qsofa-rules.ts`, `qsofa-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `qsofa-grader.test.ts`, `qsofa-rules.test.ts` — cover each threshold
  boundary (RR 21/22, GCS 14/15, SBP 100/101) and every total 0–3.

## Verify

```sh
bin/test-form quick-sequential-organ-failure-assessment
bin/test-sql-apply quick-sequential-organ-failure-assessment
bin/test-personas quick-sequential-organ-failure-assessment
bin/test-e2e --html quick-sequential-organ-failure-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
