---
name: mental-health-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Mental Health Assessment form (forms/mental-health-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Mental Health Assessment — Maintainer Skill

Implementation-facing companion to `mental-health-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/mental-health-assessment/` contains:

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

- **Instrument**: PHQ-9 + GAD-7
- **Range**: PHQ-9 (0-27), GAD-7 (0-21)
- **Categories**: PHQ-9: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-19 Moderately severe, 20-27 Severe. GAD-7: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe
- **Engine files**: `types.ts`, `mh-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `mh-grader.test.ts`

## Verify

```sh
bin/test-form mental-health-assessment
bin/test-sql-apply mental-health-assessment
bin/test-personas mental-health-assessment
bin/test-e2e --html mental-health-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
