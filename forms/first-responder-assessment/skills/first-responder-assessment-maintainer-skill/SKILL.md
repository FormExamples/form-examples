---
name: first-responder-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the First Responder Assessment form (forms/first-responder-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# First Responder Assessment — Maintainer Skill

Implementation-facing companion to `first-responder-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/first-responder-assessment/` contains:

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

- **Instrument**: First Responder Competency Framework
- **Competency Levels**: Not Competent (1), Developing (2), Competent (3), Expert (4)
- **Overall Fitness Decisions**: Fit for duty, Fit with restrictions, Temporarily unfit, Permanently unfit
- **Engine files**: `types.ts`, `responder-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `responder-grader.test.ts`

## Verify

```sh
bin/test-form first-responder-assessment
bin/test-sql-apply first-responder-assessment
bin/test-personas first-responder-assessment
bin/test-e2e --html first-responder-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
