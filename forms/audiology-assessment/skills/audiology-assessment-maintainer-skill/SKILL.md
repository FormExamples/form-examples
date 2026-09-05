---
name: audiology-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Audiology Assessment form (forms/audiology-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Audiology Assessment — Maintainer Skill

Implementation-facing companion to `audiology-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/audiology-assessment/` contains:

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

- **Instrument**: Hearing Level Grade
- **Range**: Multi-level categorical based on pure tone average (dB HL)
- **Categories**: Normal (<=25 dB), Mild (26-40 dB), Moderate (41-55 dB), Moderately Severe (56-70 dB), Severe (71-90 dB), Profound (>90 dB)
- **Engine files**: `types.ts`, `hearing-grader.ts`, `hearing-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `hearing-grader.test.ts`

## Verify

```sh
bin/test-form audiology-assessment
bin/test-sql-apply audiology-assessment
bin/test-personas audiology-assessment
bin/test-e2e --html audiology-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
