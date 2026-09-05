---
name: endocrinology-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Endocrinology Assessment form (forms/endocrinology-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Endocrinology Assessment — Maintainer Skill

Implementation-facing companion to `endocrinology-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/endocrinology-assessment/` contains:

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

- **Instrument**: Endocrine Symptom & Biochemical Review
- **Range**: Normal / Subclinical / Mild / Moderate / Severe disturbance per axis
- **Axes**: Thyroid, Adrenal, Glucose, Reproductive, Pituitary, Bone & Calcium
- **Engine files**: `types.ts`, `endocrine-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `endocrine-grader.test.ts`

## Verify

```sh
bin/test-form endocrinology-assessment
bin/test-sql-apply endocrinology-assessment
bin/test-personas endocrinology-assessment
bin/test-e2e --html endocrinology-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
