---
name: occupational-therapy-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Occupational Therapy Assessment form (forms/occupational-therapy-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Occupational Therapy Assessment — Maintainer Skill

Implementation-facing companion to `occupational-therapy-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/occupational-therapy-assessment/` contains:

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

- **Instrument**: COPM (Canadian Occupational Performance Measure)
- **Range**: Performance (1-10), Satisfaction (1-10)
- **Categories**: <5 = Significant issues, 5-7 = Moderate concerns, >7 = Good performance
- **Engine files**: `types.ts`, `copm-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `copm-grader.test.ts`

## Verify

```sh
bin/test-form occupational-therapy-assessment
bin/test-sql-apply occupational-therapy-assessment
bin/test-personas occupational-therapy-assessment
bin/test-e2e --html occupational-therapy-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
