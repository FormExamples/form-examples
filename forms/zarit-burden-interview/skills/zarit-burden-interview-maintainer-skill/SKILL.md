---
name: zarit-burden-interview-maintainer-skill
description: "Implementation workflow for maintaining and extending the Zarit Burden Interview (ZBI) form (forms/zarit-burden-interview/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Zarit Burden Interview (ZBI) — Maintainer Skill

Implementation-facing companion to `zarit-burden-interview-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/zarit-burden-interview/` contains:

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

- **Input shape:** `ZaritAssessment` TypeScript type — the context and subject
  fields plus the 22 item ratings (`item1`…`item22`, each `0 | 1 | 2 | 3 | 4 |
  null`) and the `instrumentForm` selector (`'zbi22' | 'zbi12'`).
- **Output shape:**
  ```ts
  gradeZarit(data: ZaritAssessment): {
    firedItems: FiredItem[];
    totalScore: number;              // 0..88 (ZBI-22) or 0..48 (ZBI-12)
    maxScore: 88 | 48;
    burdenBand:
      | 'little-or-none' | 'mild-to-moderate' | 'moderate-to-severe' | 'severe'
      | 'lower' | 'high';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — sum the answered ratings over the active item set
  (all 22, or the 12 short-form items `1,2,3,6,9,10,11,12,17,20,21,22`); a
  missing rating contributes 0 and raises a data-completeness flag. The total
  maps to a burden band (ZBI-22: 0–21 / 22–40 / 41–60 / 61–88; ZBI-12: <17 /
  ≥17). See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `zarit-rules.ts`, `zarit-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `zarit-grader.test.ts`, `zarit-rules.test.ts` — cover each band
  boundary (21/22, 40/41, 60/61 for ZBI-22; 16/17 for ZBI-12), the all-0 minimum
  and all-4 maximum, missing-item handling, and both instrument forms.

## Verify

```sh
bin/test-form zarit-burden-interview
bin/test-sql-apply zarit-burden-interview
bin/test-personas zarit-burden-interview
bin/test-e2e --html zarit-burden-interview
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
