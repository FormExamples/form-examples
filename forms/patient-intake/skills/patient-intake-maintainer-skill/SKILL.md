---
name: patient-intake-maintainer-skill
description: "Implementation workflow for maintaining and extending the Patient Intake form (forms/patient-intake/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Patient Intake — Maintainer Skill

Implementation-facing companion to `patient-intake-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/patient-intake/` contains:

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

- **Instrument**: Risk Level
- **Range**: Low / Medium / High
- **Categories**: Low = minimal risk factors, Medium = some risk factors present, High = significant risk factors requiring attention
- **Engine files**: `types.ts`, `intake-grader.ts`, `intake-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `intake-grader.test.ts`

## Verify

```sh
bin/test-form patient-intake
bin/test-sql-apply patient-intake
bin/test-personas patient-intake
bin/test-e2e --html patient-intake
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
