---
name: sequential-organ-failure-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Sequential Organ Failure Assessment (SOFA) form (forms/sequential-organ-failure-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Sequential Organ Failure Assessment (SOFA) — Maintainer Skill

Implementation-facing companion to `sequential-organ-failure-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/sequential-organ-failure-assessment/` contains:

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

- **Input shape:** `SofaAssessment` TypeScript type containing six organ-system
  sub-groups (respiration, coagulation, liver, cardiovascular, cns, renal) plus
  context and baseline fields.
- **Output shape:**
  ```ts
  gradeSofa(data: SofaAssessment): {
    subScores: {
      respiration: 0|1|2|3|4|null;
      coagulation: 0|1|2|3|4|null;
      liver: 0|1|2|3|4|null;
      cardiovascular: 0|1|2|3|4|null;
      cns: 0|1|2|3|4|null;
      renal: 0|1|2|3|4|null;
    };
    totalSofa: number;            // 0..24
    deltaSofa: number | null;     // totalSofa - baselineSofaTotal
    mortalityBand: 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';
    sepsis3: boolean;
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  };
  ```
- **Algorithm:** map each system's input(s) to a 0–4 sub-score using the
  published thresholds; cardiovascular and renal take the maximum of their two
  criteria; respiration sub-scores 3–4 require respiratory support; sum to a
  total 0–24; derive delta-SOFA from the baseline; band the total for mortality;
  set the Sepsis-3 flag when infection is suspected and delta-SOFA ≥ 2. A missing
  input yields a `null` sub-score and an incomplete-assessment flag — never guess.
- **Engine files:**
  - `types.ts` — `SofaAssessment`, `SofaResult`, `FiredRule`, `FlaggedIssue`.
  - `sofa-rules.ts` — the six per-system threshold tables and their mappers.
  - `sofa-grader.ts` — orchestration: sub-scores → total → delta → band → sepsis.
  - `flagged-issues.ts` — severe single-organ, multi-organ, rising-SOFA, high-risk.
  - `utils.ts` — unit conversion (kPa↔mmHg, µmol/L↔mg/dL), safe numeric parsing.
- **Tests:** `sofa-grader.test.ts` (boundary cases per system + totals + delta).

## Verify

```sh
bin/test-form sequential-organ-failure-assessment
bin/test-sql-apply sequential-organ-failure-assessment
bin/test-personas sequential-organ-failure-assessment
bin/test-e2e --html sequential-organ-failure-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
