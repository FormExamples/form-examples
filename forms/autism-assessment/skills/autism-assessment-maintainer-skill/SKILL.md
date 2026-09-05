---
name: autism-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Autism Assessment form (forms/autism-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Autism Assessment — Maintainer Skill

Implementation-facing companion to `autism-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/autism-assessment/` contains:

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

- **Instrument**: AQ-10 Score (Autism Spectrum Quotient - 10 item)
- **Range**: 0-10 (each of the 10 items scores 0 or 1)
- **Categories**: 0-5 = Below threshold, >=6 = Referral for diagnostic assessment recommended
- **Engine files**: `types.ts`, `aq10-grader.ts`, `aq10-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `aq10-grader.test.ts`

## Verify

```sh
bin/test-form autism-assessment
bin/test-sql-apply autism-assessment
bin/test-personas autism-assessment
bin/test-e2e --html autism-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
