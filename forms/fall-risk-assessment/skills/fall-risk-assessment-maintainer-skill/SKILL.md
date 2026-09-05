---
name: fall-risk-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Fall Risk Assessment form (forms/fall-risk-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Fall Risk Assessment — Maintainer Skill

Implementation-facing companion to `fall-risk-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/fall-risk-assessment/` contains:

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

- **Instrument**: Morse Fall Scale (MFS)
- **Range**: 0-125
- **Categories**:
  - Low Risk: MFS 0-24
  - Moderate Risk: MFS 25-44
  - High Risk: MFS >= 45
  - Critical: Recurrent falls with injury, anticoagulated patient, or MFS >= 75
- **Engine files**: `types.ts`, `fall-risk-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `fall-risk-grader.test.ts`

## Verify

```sh
bin/test-form fall-risk-assessment
bin/test-sql-apply fall-risk-assessment
bin/test-personas fall-risk-assessment
bin/test-e2e --html fall-risk-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
