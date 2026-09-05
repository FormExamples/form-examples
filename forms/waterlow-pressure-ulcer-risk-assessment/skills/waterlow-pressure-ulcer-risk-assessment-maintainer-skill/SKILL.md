---
name: waterlow-pressure-ulcer-risk-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Waterlow Pressure Ulcer Risk Assessment form (forms/waterlow-pressure-ulcer-risk-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Waterlow Pressure Ulcer Risk Assessment — Maintainer Skill

Implementation-facing companion to `waterlow-pressure-ulcer-risk-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/waterlow-pressure-ulcer-risk-assessment/` contains:

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

- **Input shape:** `WaterlowAssessment` TypeScript type — the core category and
  special-risk enum inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeWaterlow(data: WaterlowAssessment): {
    buildPoints: number;
    skinPoints: number;
    sexPoints: number;
    agePoints: number;
    continencePoints: number;
    mobilityPoints: number;
    tissueMalnutritionPoints: number;
    neurologicalDeficitPoints: number;
    majorSurgeryTraumaPoints: number;
    medicationPoints: number;
    waterlowScore: number;
    riskBand: 'low' | 'at-risk' | 'high' | 'very-high';
    contributingCategories: ContributingCategory[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive weighted sum — each core category maps its selected
  enum to points; sex-and-age adds `sexPoints + agePoints`; each special-risk
  group maps its highest applicable enum to points. All contributions are summed
  into `waterlowScore`, which selects the band via `≥ 20 → very-high`,
  `≥ 15 → high`, `≥ 10 → at-risk`, else `low`. See spec §4. A missing enum
  contributes 0 and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `waterlow-rules.ts`,
  `waterlow-grader.ts`, `flagged-issues.ts`.
- **Tests:** `waterlow-grader.test.ts`, `waterlow-rules.test.ts` — cover each
  band boundary (9/10, 14/15, 19/20) and every category's point mapping.

## Verify

```sh
bin/test-form waterlow-pressure-ulcer-risk-assessment
bin/test-sql-apply waterlow-pressure-ulcer-risk-assessment
bin/test-personas waterlow-pressure-ulcer-risk-assessment
bin/test-e2e --html waterlow-pressure-ulcer-risk-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
