---
name: apgar-score-maintainer-skill
description: "Implementation workflow for maintaining and extending the Apgar Score form (forms/apgar-score/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Apgar Score — Maintainer Skill

Implementation-facing companion to `apgar-score-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/apgar-score/` contains:

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

- **Input shape:** `ApgarAssessment` TypeScript type — birth context,
  identification, resuscitation notes, and a repeated array of per-timepoint
  five-sign scores.
- **Output shape:**
  ```ts
  gradeApgar(data: ApgarAssessment): {
    timepoints: Array<{
      timepointMinutes: number;
      total: number;                                   // 0..10
      band: 'reassuring' | 'moderately-low' | 'low';
    }>;
    trend: 'improving' | 'static' | 'falling' | 'insufficient';
    firedSigns: FiredSign[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — per timepoint, sum the five signs (each 0/1/2) to a
  total of 0–10; the total determines the band (`>= 7` reassuring, `4–6`
  moderately low, `<= 3` low). The trend compares consecutive scored timepoints.
  See spec §4. A missing sign contributes 0 and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `apgar-rules.ts`, `apgar-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `apgar-grader.test.ts`, `apgar-rules.test.ts` — cover each band
  boundary (totals 3/4, 6/7), every trend direction, and the conditional
  10-minute rule.

## Verify

```sh
bin/test-form apgar-score
bin/test-sql-apply apgar-score
bin/test-personas apgar-score
bin/test-e2e --html apgar-score
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
