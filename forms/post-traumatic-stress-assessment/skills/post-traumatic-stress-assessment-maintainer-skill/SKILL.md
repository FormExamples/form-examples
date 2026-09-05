---
name: post-traumatic-stress-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Post-Traumatic Stress Assessment form (forms/post-traumatic-stress-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Post-Traumatic Stress Assessment — Maintainer Skill

Implementation-facing companion to `post-traumatic-stress-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/post-traumatic-stress-assessment/` contains:

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

- **Instrument**: PCL-5 (PTSD Checklist for DSM-5) — 20 items scored 0-4
- **Range**: 0-80 total score
- **Categories**:
  - Minimal (0-20)
  - Mild (21-32)
  - Moderate (33-37) — probable PTSD threshold
  - Severe (38-80)
- **Engine files**: `types.ts`, `pcl5-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `pcl5-grader.test.ts`

## Verify

```sh
bin/test-form post-traumatic-stress-assessment
bin/test-sql-apply post-traumatic-stress-assessment
bin/test-personas post-traumatic-stress-assessment
bin/test-e2e --html post-traumatic-stress-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
