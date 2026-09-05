---
name: workplace-climate-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Workplace Climate Assessment form (forms/workplace-climate-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Workplace Climate Assessment — Maintainer Skill

Implementation-facing companion to `workplace-climate-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/workplace-climate-assessment/` contains:

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

- **Instrument**: Workplace Climate Index (Likert-scale 1-5 per item)
- **Range**: 0-100 (normalized composite score)
- **Categories**:
  - Thriving (85-100): Strong, inclusive, psychologically safe climate
  - Healthy (70-84): Generally positive climate with minor growth areas
  - Developing (50-69): Mixed climate with several improvement areas
  - Strained (25-49): Concerning climate requiring intervention
  - Critical (0-24): Severely unhealthy climate requiring urgent action
- **Engine files**: `types.ts`, `grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `grader.test.ts`

## Verify

```sh
bin/test-form workplace-climate-assessment
bin/test-sql-apply workplace-climate-assessment
bin/test-personas workplace-climate-assessment
bin/test-e2e --html workplace-climate-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
