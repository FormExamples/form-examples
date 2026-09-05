---
name: palliative-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Palliative Assessment form (forms/palliative-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Palliative Assessment — Maintainer Skill

Implementation-facing companion to `palliative-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/palliative-assessment/` contains:

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

- **Instrument**: ESAS-r (10 symptoms scored 0-10)
- **Range**: Total 0-100
- **Categories**:
  - None (0-10)
  - Mild (11-30)
  - Moderate (31-60)
  - Severe (61-100)
- **Individual flag**: Any symptom ≥ 7
- **Engine files**: `types.ts`, `esas-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `esas-grader.test.ts`

## Verify

```sh
bin/test-form palliative-assessment
bin/test-sql-apply palliative-assessment
bin/test-personas palliative-assessment
bin/test-e2e --html palliative-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
