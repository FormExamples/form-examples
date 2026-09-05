---
name: outpatient-outcome-maintainer-skill
description: "Implementation workflow for maintaining and extending the Outpatient Outcome Report form (forms/outpatient-outcome/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Outpatient Outcome Report — Maintainer Skill

Implementation-facing companion to `outpatient-outcome-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/outpatient-outcome/` contains:

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

- **Instrument**: Outpatient Outcome Composite Grade (OOCG)
- **Domains**: Clinical, PROM, PREM, Operational (each A–E; overall = worst)
- **PROM sub-instruments**: EQ-5D-5L, Global Rating of Change (GRC), PROMIS Global Health v1.2
- **PREM sub-instrument**: Friends and Family Test (FFT)
- **Operational sub-instruments**: NHS Attendance Outcome code, wait-time vs target, modality

## Verify

```sh
bin/test-form outpatient-outcome
bin/test-sql-apply outpatient-outcome
bin/test-personas outpatient-outcome
bin/test-e2e --html outpatient-outcome
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
