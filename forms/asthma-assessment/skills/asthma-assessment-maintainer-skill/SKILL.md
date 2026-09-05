---
name: asthma-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Asthma Assessment form (forms/asthma-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Asthma Assessment — Maintainer Skill

Implementation-facing companion to `asthma-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/asthma-assessment/` contains:

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

- **Instrument**: ACT Score (Asthma Control Test)
- **Range**: 5-25 (sum of 5 questions, each scored 1-5)
- **Categories**: <=15 = Not well controlled, 16-19 = Not well controlled, 20-25 = Well controlled
- **Engine files**: `types.ts`, `act-grader.ts`, `act-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `act-grader.test.ts`

## Verify

```sh
bin/test-form asthma-assessment
bin/test-sql-apply asthma-assessment
bin/test-personas asthma-assessment
bin/test-e2e --html asthma-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
