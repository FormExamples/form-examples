---
name: agile-consulting-scorecard-for-hiring-help-maintainer-skill
description: "Implementation workflow for maintaining and extending the Agile consulting scorecard for hiring help form (forms/agile-consulting-scorecard-for-hiring-help/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Agile consulting scorecard for hiring help — Maintainer Skill

Implementation-facing companion to `agile-consulting-scorecard-for-hiring-help-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/agile-consulting-scorecard-for-hiring-help/` contains:

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

- **Input shape:** `AgileConsultingScorecardAssessment` TypeScript type
  containing organization metadata, respondent metadata, and the sixteen
  boolean checklist answers (`item01`..`item16`) with optional evidence
  text per item.
- **Output shape:**
  ```ts
  gradeScorecard(data: AgileConsultingScorecardAssessment): {
    scoreTotal: number;                       // 0..16
    scoreBand: 'low' | 'borderline' | 'medium' | 'high';
    manifestoSubtotal: number;                // 0..4
    principlesSubtotal: number;               // 0..12
    firedRules: FiredRule[];                  // one per item, recording the answer
    additionalFlags: AdditionalFlag[];        // readiness flags
  }
  ```
- **Algorithm:** sum-of-points. Each `true` answer scores 1; the band
  is read from the table:
  - 0–4 → `low`
  - 5 → `borderline`
  - 6–10 → `medium`
  - 11–16 → `high`
- **Engine files:**
  `types.ts`, `utils.ts`, `manifesto-rules.ts`, `principles-rules.ts`,
  `score-grader.ts`, `flagged-issues.ts`.
- **Tests:** `score-grader.test.ts`, `manifesto-rules.test.ts`,
  `principles-rules.test.ts`, `flagged-issues.test.ts`.

## Verify

```sh
bin/test-form agile-consulting-scorecard-for-hiring-help
bin/test-sql-apply agile-consulting-scorecard-for-hiring-help
bin/test-personas agile-consulting-scorecard-for-hiring-help
bin/test-e2e --html agile-consulting-scorecard-for-hiring-help
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
