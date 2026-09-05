---
name: endometriosis-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Endometriosis Assessment form (forms/endometriosis-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Endometriosis Assessment — Maintainer Skill

Implementation-facing companion to `endometriosis-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/endometriosis-assessment/` contains:

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

- **Instrument**: Revised ASRM Staging + EHP-30 Quality of Life
- **Range**: ASRM Stage I-IV (points-based), EHP-30 0-100 per domain
- **Categories**:
  - Stage I (Minimal): 1-5 points
  - Stage II (Mild): 6-15 points
  - Stage III (Moderate): 16-40 points
  - Stage IV (Severe): >40 points
- **Severity**:
  - Mild: Stage I-II, manageable symptoms
  - Moderate: Stage II-III, significant impact
  - Severe: Stage III-IV, debilitating
  - Critical: Bowel/urinary obstruction, fertility crisis
- **Engine files**: `types.ts`, `endo-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `endo-grader.test.ts`

## Verify

```sh
bin/test-form endometriosis-assessment
bin/test-sql-apply endometriosis-assessment
bin/test-personas endometriosis-assessment
bin/test-e2e --html endometriosis-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
