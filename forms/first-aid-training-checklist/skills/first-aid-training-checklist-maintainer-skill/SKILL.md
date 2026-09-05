---
name: first-aid-training-checklist-maintainer-skill
description: "Implementation workflow for maintaining and extending the First Aid Training Checklist form (forms/first-aid-training-checklist/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# First Aid Training Checklist — Maintainer Skill

Implementation-facing companion to `first-aid-training-checklist-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/first-aid-training-checklist/` contains:

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

- **Instrument**: First Aid at Work Competency Assessment
- **Range**: Pass / Fail / Needs Development
- **Categories**:
  - Pass: All skills demonstrated to competent standard
  - Needs Development: Minor deficiencies; targeted retraining
  - Fail: Critical deficiency in life-saving skills
- **Engine files**: `types.ts`, `first-aid-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `first-aid-grader.test.ts`

## Verify

```sh
bin/test-form first-aid-training-checklist
bin/test-sql-apply first-aid-training-checklist
bin/test-personas first-aid-training-checklist
bin/test-e2e --html first-aid-training-checklist
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
