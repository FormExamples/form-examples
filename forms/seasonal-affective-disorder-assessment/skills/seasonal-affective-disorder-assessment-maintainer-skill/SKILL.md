---
name: seasonal-affective-disorder-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Seasonal Affective Disorder Assessment form (forms/seasonal-affective-disorder-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Seasonal Affective Disorder Assessment — Maintainer Skill

Implementation-facing companion to `seasonal-affective-disorder-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/seasonal-affective-disorder-assessment/` contains:

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

- **Instruments**: SPAQ Global Seasonality Score (GSS) + PHQ-9 Depression Severity
- **SPAQ GSS Range**: 0-24 (6 items, each 0-4)
  - 0-7: No SAD
  - 8-10: Subsyndromal SAD
  - 11-24: SAD likely
- **PHQ-9 Range**: 0-27 (9 items, each 0-3)
  - 0-4: Minimal depression
  - 5-9: Mild depression
  - 10-14: Moderate depression
  - 15-19: Moderately severe depression
  - 20-27: Severe depression
- **Combined Severity**: no-sad, mild, moderate, severe, critical
- **Engine files**: `types.ts`, `sad-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `sad-grader.test.ts`

## Verify

```sh
bin/test-form seasonal-affective-disorder-assessment
bin/test-sql-apply seasonal-affective-disorder-assessment
bin/test-personas seasonal-affective-disorder-assessment
bin/test-e2e --html seasonal-affective-disorder-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
