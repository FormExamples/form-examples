---
name: substance-abuse-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Substance Abuse Assessment form (forms/substance-abuse-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Substance Abuse Assessment — Maintainer Skill

Implementation-facing companion to `substance-abuse-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/substance-abuse-assessment/` contains:

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

- **Instruments**: AUDIT (0-40) + DAST-10 (0-10)
- **AUDIT Categories**:
  - Low risk (0-7): Education on safe drinking
  - Hazardous (8-15): Simple advice and brief intervention
  - Harmful (16-19): Brief intervention and continued monitoring
  - Dependence likely (20-40): Referral to specialist for diagnostic evaluation and treatment
- **DAST-10 Categories**:
  - No problems (0): No intervention needed
  - Low level (1-2): Monitor and reassess
  - Moderate level (3-5): Further investigation and brief intervention
  - Substantial level (6-8): Intensive assessment and treatment
  - Severe level (9-10): Intensive assessment and treatment, referral to specialist
- **Combined Severity**: low, moderate, high, critical (active withdrawal/overdose risk)
- **Engine files**: `types.ts`, `substance-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `substance-grader.test.ts`

## Verify

```sh
bin/test-form substance-abuse-assessment
bin/test-sql-apply substance-abuse-assessment
bin/test-personas substance-abuse-assessment
bin/test-e2e --html substance-abuse-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
