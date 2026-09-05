---
name: modified-early-warning-score-maintainer-skill
description: "Implementation workflow for maintaining and extending the Modified Early Warning Score (MEWS) form (forms/modified-early-warning-score/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Modified Early Warning Score (MEWS) — Maintainer Skill

Implementation-facing companion to `modified-early-warning-score-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/modified-early-warning-score/` contains:

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

- **Input shape:** `MewsObservation` TypeScript type — the five parameter inputs
  plus context, identification, and optional `previousMewsScore`.
- **Output shape:**
  ```ts
  gradeMews(data: MewsObservation): {
    systolicBloodPressurePoint: 0 | 1 | 2 | 3;
    heartRatePoint: 0 | 1 | 2 | 3;
    respiratoryRatePoint: 0 | 1 | 2 | 3;
    temperaturePoint: 0 | 1 | 2 | 3;
    avpuPoint: 0 | 1 | 2 | 3;
    mewsScore: number;              // 0..14
    riskBand: 'low' | 'medium' | 'high';
    singleParameterTrigger: boolean;
    firedParameters: FiredParameter[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** each parameter maps its measured value to a 0–3 sub-score via
  the Subbe (2001) allocation table; the sub-scores sum to the aggregate 0–14.
  `riskBand` is `high` (≥ 5), `medium` (2–4), or `low` (0–1);
  `singleParameterTrigger` is true when any sub-score equals 3. See spec §4. A
  missing numeric input contributes 0 points and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `mews-rules.ts`, `mews-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `mews-grader.test.ts`, `mews-rules.test.ts` — cover every allocation
  band boundary (SBP 70/71, 80/81, 100/101, 199/200; HR 40/41, 50/51, 100/101,
  110/111, 129/130; RR 8/9, 14/15, 20/21, 29/30; temperature 34.9/35.0,
  38.4/38.5; each AVPU level), the aggregate band edges (1/2, 4/5), and the
  single-parameter=3 trigger.

## Verify

```sh
bin/test-form modified-early-warning-score
bin/test-sql-apply modified-early-warning-score
bin/test-personas modified-early-warning-score
bin/test-e2e --html modified-early-warning-score
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
