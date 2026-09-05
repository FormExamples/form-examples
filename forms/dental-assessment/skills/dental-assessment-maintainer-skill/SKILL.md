---
name: dental-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Dental Assessment form (forms/dental-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Dental Assessment — Maintainer Skill

Implementation-facing companion to `dental-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/dental-assessment/` contains:

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

- **Instrument**: DMFT (Decayed, Missing, Filled Teeth) Index
- **Range**: 0-28 (for permanent teeth)
- **Categories**:
  - D: Number of decayed teeth
  - M: Number of missing teeth
  - F: Number of filled teeth
  - Total DMFT: Sum of D + M + F
- **Engine files**: `types.ts`, `dmft-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `dmft-grader.test.ts`

## Verify

```sh
bin/test-form dental-assessment
bin/test-sql-apply dental-assessment
bin/test-personas dental-assessment
bin/test-e2e --html dental-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
