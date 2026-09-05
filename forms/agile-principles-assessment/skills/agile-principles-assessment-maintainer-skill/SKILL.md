---
name: agile-principles-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Agile Principles Assessment form (forms/agile-principles-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Agile Principles Assessment — Maintainer Skill

Implementation-facing companion to `agile-principles-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/agile-principles-assessment/` contains:

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

- **Input shape:** `AgileAssessment` TypeScript type containing the
  respondent identification block plus 12 `PrincipleResponse` objects
  (`{ score: 1|2|3|4|5|null; comment: string }`).
- **Output shape:**
  ```ts
  calculateMaturity(data: AgileAssessment): {
    answeredCount: number;        // 0..12
    meanScore: number | null;     // null if fewer than 6 answered
    maturity: 'optimising' | 'mature' | 'developing' | 'initial'
            | 'ad-hoc' | 'insufficient-data';
    perPrincipleBands: Array<'high' | 'mid' | 'low' | 'unanswered'>;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** unweighted mean of answered principle scores; thresholds in
  `index.md`. Each principle below 3 fires its own coaching rule; any score
  of 1 raises a critical-gap flag.
- **Engine files:** `types.ts`, `factory.ts`, `principles.ts`,
  `maturity-rules.ts`, `flagged-issues.ts`, `composite-grader.ts`.
- **Tests:** `composite-grader.test.ts`, `maturity-rules.test.ts`.

## Verify

```sh
bin/test-form agile-principles-assessment
bin/test-sql-apply agile-principles-assessment
bin/test-personas agile-principles-assessment
bin/test-e2e --html agile-principles-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
