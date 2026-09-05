---
name: stroke-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Stroke Assessment form (forms/stroke-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Stroke Assessment — Maintainer Skill

Implementation-facing companion to `stroke-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/stroke-assessment/` contains:

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

- **Instrument**: NIHSS (National Institutes of Health Stroke Scale)
- **Range**: 0-42
- **Categories**: 0 = No stroke symptoms, 1-4 = Minor, 5-15 = Moderate, 16-20 = Moderate to severe, 21-42 = Severe
- **Engine files**: `types.ts`, `nihss-grader.ts`, `nihss-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `nihss-grader.test.ts`

## Verify

```sh
bin/test-form stroke-assessment
bin/test-sql-apply stroke-assessment
bin/test-personas stroke-assessment
bin/test-e2e --html stroke-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
