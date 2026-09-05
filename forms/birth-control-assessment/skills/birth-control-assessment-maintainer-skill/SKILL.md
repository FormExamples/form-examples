---
name: birth-control-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Birth Control Assessment form (forms/birth-control-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Birth Control Assessment — Maintainer Skill

Implementation-facing companion to `birth-control-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/birth-control-assessment/` contains:

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

- **Instrument**: UK Medical Eligibility Criteria (UK MEC) for Contraceptive Use
- **Range**: UK MEC Category 1-4
- **Categories**:
  - UK MEC 1: No restriction for use of the contraceptive method
  - UK MEC 2: Advantages of using the method generally outweigh the theoretical or proven risks
  - UK MEC 3: Theoretical or proven risks usually outweigh the advantages of using the method
  - UK MEC 4: Unacceptable health risk if the contraceptive method is used
- **Engine files**: `types.ts`, `mec-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `mec-grader.test.ts`

## Verify

```sh
bin/test-form birth-control-assessment
bin/test-sql-apply birth-control-assessment
bin/test-personas birth-control-assessment
bin/test-e2e --html birth-control-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
