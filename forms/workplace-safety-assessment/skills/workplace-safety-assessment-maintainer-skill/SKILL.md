---
name: workplace-safety-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Workplace Safety Assessment form (forms/workplace-safety-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Workplace Safety Assessment — Maintainer Skill

Implementation-facing companion to `workplace-safety-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/workplace-safety-assessment/` contains:

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

- **Instrument**: HSE Workplace Safety Audit Checklist
- **Range**: Compliant / Minor Findings / Major Findings / Critical Findings
- **Categories**:
  - Compliant: All controls in place
  - Minor Findings: Low-risk gaps, action within 90 days
  - Major Findings: Moderate-risk gaps, action within 30 days
  - Critical Findings: Imminent risk, immediate corrective action
- **Engine files**: `types.ts`, `safety-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `safety-grader.test.ts`

## Verify

```sh
bin/test-form workplace-safety-assessment
bin/test-sql-apply workplace-safety-assessment
bin/test-personas workplace-safety-assessment
bin/test-e2e --html workplace-safety-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
