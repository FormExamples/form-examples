---
name: dyslexia-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Dyslexia Assessment form (forms/dyslexia-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Dyslexia Assessment — Maintainer Skill

Implementation-facing companion to `dyslexia-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/dyslexia-assessment/` contains:

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

- **Instrument**: Standardized score assessment battery
- **Range**: Standard scores (mean 100, SD 15)
- **Categories**:
  - Standard score 85-115: Average (no dyslexia)
  - Standard score 70-84: Below average (mild dyslexia)
  - Standard score 55-69: Well below average (moderate dyslexia)
  - Standard score <55: Significantly below average (severe dyslexia)
- **Severity levels**:
  - No dyslexia: All scores within normal limits
  - Mild: Borderline scores, some difficulties
  - Moderate: Below average, consistent pattern of difficulty
  - Severe: Significantly below average, pervasive impact
- **Engine files**: `types.ts`, `dyslexia-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `dyslexia-grader.test.ts`

## Verify

```sh
bin/test-form dyslexia-assessment
bin/test-sql-apply dyslexia-assessment
bin/test-personas dyslexia-assessment
bin/test-e2e --html dyslexia-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
