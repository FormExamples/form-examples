---
name: oncology-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Oncology Assessment form (forms/oncology-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Oncology Assessment — Maintainer Skill

Implementation-facing companion to `oncology-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/oncology-assessment/` contains:

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

- **Instrument**: ECOG Performance Status
- **Range**: 0-5
- **Categories**: 0 = Fully active, 1 = Restricted, 2 = Ambulatory, 3 = Limited self-care, 4 = Completely disabled, 5 = Dead
- **Engine files**: `types.ts`, `ecog-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `ecog-grader.test.ts`

## Verify

```sh
bin/test-form oncology-assessment
bin/test-sql-apply oncology-assessment
bin/test-personas oncology-assessment
bin/test-e2e --html oncology-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
