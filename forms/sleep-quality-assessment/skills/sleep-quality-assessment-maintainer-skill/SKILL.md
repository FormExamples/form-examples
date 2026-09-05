---
name: sleep-quality-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Sleep Quality Assessment form (forms/sleep-quality-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Sleep Quality Assessment — Maintainer Skill

Implementation-facing companion to `sleep-quality-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/sleep-quality-assessment/` contains:

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

- **Instrument**: PSQI (Pittsburgh Sleep Quality Index)
- **Range**: 0-21
- **Categories**: 0-5 = Good sleep quality, 6-10 = Poor sleep quality, 11-21 = Very poor sleep quality
- **Engine files**: `types.ts`, `psqi-grader.ts`, `psqi-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `psqi-grader.test.ts`

## Verify

```sh
bin/test-form sleep-quality-assessment
bin/test-sql-apply sleep-quality-assessment
bin/test-personas sleep-quality-assessment
bin/test-e2e --html sleep-quality-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
