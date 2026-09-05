---
name: edinburgh-postnatal-depression-scale-maintainer-skill
description: "Implementation workflow for maintaining and extending the Edinburgh Postnatal Depression Scale (EPDS) form (forms/edinburgh-postnatal-depression-scale/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Edinburgh Postnatal Depression Scale (EPDS) — Maintainer Skill

Implementation-facing companion to `edinburgh-postnatal-depression-scale-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/edinburgh-postnatal-depression-scale/` contains:

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

- **Input shape:** `EpdsAssessment` TypeScript type — the ten item responses plus
  context and identification fields. Each item response is the **already-scored**
  0–3 value; the reverse-scoring is applied when mapping the printed option to a
  score (see spec §4), so the stored `item1..item10` values are all 0–3 with
  higher = more symptomatic.
- **Output shape:**
  ```ts
  gradeEpds(data: EpdsAssessment): {
    itemScores: [number, number, number, number, number,
                 number, number, number, number, number]; // each 0..3
    totalScore: number;          // 0..30
    band: 'lower' | 'possible' | 'likely';
    selfHarmFlag: boolean;       // item10 > 0
    firedItems: FiredItem[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — sum the ten 0–3 item scores to a total 0–30; the band
  is `>= 13` → `likely`, `>= 10` → `possible`, else `lower`. `selfHarmFlag` is
  `item10 > 0` and is computed independently of the total. See spec §4. Reverse
  scoring for items 3, 5, 6, 7, 8, 9, 10 is applied at option→score mapping
  (`score = 3 - optionIndex`); items 1, 2, 4 use `score = optionIndex`. A missing
  item response contributes 0 to the total and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `epds-rules.ts`, `epds-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `epds-grader.test.ts`, `epds-rules.test.ts` — cover the reverse-score
  mapping for each item, the band boundaries (9/10 and 12/13), the full 0–30
  range, and the item-10 safety flag for every non-zero response.

## Verify

```sh
bin/test-form edinburgh-postnatal-depression-scale
bin/test-sql-apply edinburgh-postnatal-depression-scale
bin/test-personas edinburgh-postnatal-depression-scale
bin/test-e2e --html edinburgh-postnatal-depression-scale
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
