---
name: employee-offboarding-checklist-maintainer-skill
description: "Implementation workflow for maintaining and extending the Employee Offboarding Checklist form (forms/employee-offboarding-checklist/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Employee Offboarding Checklist — Maintainer Skill

Implementation-facing companion to `employee-offboarding-checklist-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/employee-offboarding-checklist/` contains:

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

- **Instrument**: Offboarding Completeness Validation
- **Range**: Complete / Partial / Incomplete
- **Categories**:
  - Complete: All mandatory items confirmed
  - Partial: Non-blocking items outstanding
  - Incomplete: Mandatory items outstanding; requires escalation
- **Engine files**: `types.ts`, `checklist-validator.ts`, `validation-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `checklist-validator.test.ts`

## Verify

```sh
bin/test-form employee-offboarding-checklist
bin/test-sql-apply employee-offboarding-checklist
bin/test-personas employee-offboarding-checklist
bin/test-e2e --html employee-offboarding-checklist
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
