---
name: ergonomic-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Ergonomic Assessment form (forms/ergonomic-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Ergonomic Assessment — Maintainer Skill

Implementation-facing companion to `ergonomic-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/ergonomic-assessment/` contains:

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

- **Instrument**: REBA (Rapid Entire Body Assessment)
- **Range**: 1-15
- **Categories**:
  - 1: Negligible risk, no action required
  - 2-3: Low risk, change may be needed
  - 4-7: Medium risk, further investigation and change soon
  - 8-10: High risk, investigate and implement change
  - 11-15: Very high risk, implement change immediately
- **Engine files**: `types.ts`, `reba-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `reba-grader.test.ts`

## Verify

```sh
bin/test-form ergonomic-assessment
bin/test-sql-apply ergonomic-assessment
bin/test-personas ergonomic-assessment
bin/test-e2e --html ergonomic-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
