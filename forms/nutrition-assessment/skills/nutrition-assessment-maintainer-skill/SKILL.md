---
name: nutrition-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Nutrition Assessment form (forms/nutrition-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Nutrition Assessment — Maintainer Skill

Implementation-facing companion to `nutrition-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/nutrition-assessment/` contains:

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

## Scoring system

- **Instrument**: Malnutrition Universal Screening Tool (MUST)
- **MUST Steps**:
  - Step 1: BMI score (0 = BMI >20, 1 = BMI 18.5-20, 2 = BMI <18.5)
  - Step 2: Unplanned weight loss score (0 = <5%, 1 = 5-10%, 2 = >10%)
  - Step 3: Acute disease effect score (0 = none, 2 = acutely ill with no intake >5 days)
- **Total score**: 0 = low risk, 1 = medium risk, >=2 = high risk
- **Severity levels**: low (well-nourished), moderate (at risk), high (malnourished), critical (severe malnutrition with complications)
- **Engine files**: `types.ts`, `nutrition-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `nutrition-grader.test.ts`

## Verify

```sh
bin/test-form nutrition-assessment
bin/test-sql-apply nutrition-assessment
bin/test-personas nutrition-assessment
bin/test-e2e --html nutrition-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
