---
name: paediatric-early-warning-score-maintainer-skill
description: "Implementation workflow for maintaining and extending the Paediatric Early Warning Score (PEWS) form (forms/paediatric-early-warning-score/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Paediatric Early Warning Score (PEWS) — Maintainer Skill

Implementation-facing companion to `paediatric-early-warning-score-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/paediatric-early-warning-score/` contains:

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

- **Input shape:** `PewsAssessment` TypeScript type — the age band, the seven
  parameter inputs, the two concern flags, plus context and identification.
- **Output shape:**
  ```ts
  gradePews(data: PewsAssessment): {
    respiratoryRateScore: 0 | 1 | 2 | 3;
    respiratoryEffortScore: 0 | 1 | 2 | 3;
    oxygenSaturationScore: 0 | 1 | 2 | 3;
    supplementalOxygenScore: 0 | 1 | 2 | 3;
    heartRateScore: 0 | 1 | 2 | 3;
    capillaryRefillScore: 0 | 1 | 2 | 3;
    consciousnessScore: 0 | 1 | 2 | 3;
    aggregateScore: number;                 // 0..21
    maxParameterScore: 0 | 1 | 2 | 3;
    escalationBand: 'routine' | 'low' | 'medium' | 'high';
    firedTriggers: FiredTrigger[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** age-band-driven then additive. Resolve the age-band normal
  ranges for respiratory rate and heart rate; score every parameter 0–3; sum to
  `aggregateScore`; map to `escalationBand` (`≥6` high, `4–5` medium, `2–3` low,
  else routine). Override triggers — `maxParameterScore == 3`, `nurseConcern`,
  `parentConcern` — raise the effective escalation without changing the total.
  See spec §4. A missing numeric input contributes 0 and raises a
  data-completeness flag; an unset age band leaves the rate parameters unscored.
- **Engine files:** `types.ts`, `utils.ts`, `pews-rules.ts` (age-band tables +
  per-parameter thresholds), `pews-grader.ts`, `flagged-issues.ts`.
- **Tests:** `pews-grader.test.ts`, `pews-rules.test.ts` — cover each age band's
  rate boundaries, every parameter's 0–3 thresholds, the single-parameter=3
  override, the nurse / parent concern triggers, and each escalation-band
  boundary.

## Verify

```sh
bin/test-form paediatric-early-warning-score
bin/test-sql-apply paediatric-early-warning-score
bin/test-personas paediatric-early-warning-score
bin/test-e2e --html paediatric-early-warning-score
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
