---
name: attention-deficit-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Attention Deficit Assessment form (forms/attention-deficit-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Attention Deficit Assessment — Maintainer Skill

Implementation-facing companion to `attention-deficit-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/attention-deficit-assessment/` contains:

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

- **Instrument**: ASRS Screener (Adult ADHD Self-Report Scale v1.1)
- **Range**: Part A (6 questions, screener) + Part B (12 questions, supplemental)
- **Categories**: Part A items scored against clinically validated thresholds; 4+ darkly shaded responses in Part A = highly consistent with ADHD diagnosis
- **Engine files**: `types.ts`, `asrs-grader.ts`, `asrs-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `asrs-grader.test.ts`

## Verify

```sh
bin/test-form attention-deficit-assessment
bin/test-sql-apply attention-deficit-assessment
bin/test-personas attention-deficit-assessment
bin/test-e2e --html attention-deficit-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
