---
name: heart-health-check-maintainer-skill
description: "Implementation workflow for maintaining and extending the Heart Health Check form (forms/heart-health-check/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Heart Health Check — Maintainer Skill

Implementation-facing companion to `heart-health-check-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/heart-health-check/` contains:

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

- **Instrument**: Simplified QRISK3-based cardiovascular risk
- **Range**: 0.1–95.0% (10-year CVD risk percentage)
- **Categories**: Draft (age/sex missing), Low (<10%), Moderate (10–19.9%), High (>=20%)
- **Heart age**: Age at which an average person (non-smoker, BP 120, TC/HDL 4.0) matches the patient's risk
- **Engine files**: `types.ts`, `risk-calculator.ts`, `risk-grader.ts`, `risk-rules.ts`, `flagged-issues.ts`, `utils.ts`

## Verify

```sh
bin/test-form heart-health-check
bin/test-sql-apply heart-health-check
bin/test-personas heart-health-check
bin/test-e2e --html heart-health-check
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
