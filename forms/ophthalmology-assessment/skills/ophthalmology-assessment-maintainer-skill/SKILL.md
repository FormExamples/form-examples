---
name: ophthalmology-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Ophthalmology Assessment form (forms/ophthalmology-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Ophthalmology Assessment — Maintainer Skill

Implementation-facing companion to `ophthalmology-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/ophthalmology-assessment/` contains:

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

- **Instrument**: Visual Acuity Grade
- **Range**: Graded by visual acuity level
- **Categories**: Based on best-corrected visual acuity measurements and functional impact
- **Engine files**: `types.ts`, `va-grader.ts`, `va-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `va-grader.test.ts`

## Verify

```sh
bin/test-form ophthalmology-assessment
bin/test-sql-apply ophthalmology-assessment
bin/test-personas ophthalmology-assessment
bin/test-e2e --html ophthalmology-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
