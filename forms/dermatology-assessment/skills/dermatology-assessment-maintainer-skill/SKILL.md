---
name: dermatology-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Dermatology Assessment form (forms/dermatology-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Dermatology Assessment — Maintainer Skill

Implementation-facing companion to `dermatology-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/dermatology-assessment/` contains:

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

- **Instrument**: DLQI (Dermatology Life Quality Index)
- **Range**: 0-30
- **Categories**:
  - 0-1: No effect on patient's life
  - 2-5: Small effect on patient's life
  - 6-10: Moderate effect on patient's life
  - 11-20: Very large effect on patient's life
  - 21-30: Extremely large effect on patient's life
- **Engine files**: `types.ts`, `dlqi-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `dlqi-grader.test.ts`

## Verify

```sh
bin/test-form dermatology-assessment
bin/test-sql-apply dermatology-assessment
bin/test-personas dermatology-assessment
bin/test-e2e --html dermatology-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
