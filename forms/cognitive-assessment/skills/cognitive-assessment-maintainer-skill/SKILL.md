---
name: cognitive-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Cognitive Assessment form (forms/cognitive-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Cognitive Assessment — Maintainer Skill

Implementation-facing companion to `cognitive-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/cognitive-assessment/` contains:

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

- **Instrument**: MMSE (Mini-Mental State Examination)
- **Range**: 0-30
- **Categories**:
  - 24-30: Normal cognition
  - 18-23: Mild cognitive impairment
  - 0-17: Severe cognitive impairment
- **Engine files**: `types.ts`, `mmse-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `mmse-grader.test.ts`

## Verify

```sh
bin/test-form cognitive-assessment
bin/test-sql-apply cognitive-assessment
bin/test-personas cognitive-assessment
bin/test-e2e --html cognitive-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
