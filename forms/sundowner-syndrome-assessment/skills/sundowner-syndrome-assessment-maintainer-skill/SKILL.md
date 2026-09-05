---
name: sundowner-syndrome-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Sundowner Syndrome Assessment form (forms/sundowner-syndrome-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Sundowner Syndrome Assessment — Maintainer Skill

Implementation-facing companion to `sundowner-syndrome-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/sundowner-syndrome-assessment/` contains:

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

- **Instruments**: Cohen-Mansfield Agitation Inventory (CMAI) + Neuropsychiatric Inventory (NPI)
- **CMAI Range**: 29-203 (29 items scored 1-7)
- **NPI Range**: 0-144 (12 domains, frequency x severity)
- **Severity Categories**:
  - Mild: Occasional restlessness, redirectable, CMAI 29-45
  - Moderate: Daily episodes, requires intervention, CMAI 46-75
  - Severe: Aggressive behaviour, safety risk, CMAI 76-120
  - Critical: Self-harm risk, requires constant supervision, CMAI >120
- **Engine files**: `types.ts`, `sundowner-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `sundowner-grader.test.ts`

## Verify

```sh
bin/test-form sundowner-syndrome-assessment
bin/test-sql-apply sundowner-syndrome-assessment
bin/test-personas sundowner-syndrome-assessment
bin/test-e2e --html sundowner-syndrome-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
