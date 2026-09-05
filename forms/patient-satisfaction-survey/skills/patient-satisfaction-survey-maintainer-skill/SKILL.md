---
name: patient-satisfaction-survey-maintainer-skill
description: "Implementation workflow for maintaining and extending the Patient Satisfaction Survey form (forms/patient-satisfaction-survey/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Patient Satisfaction Survey — Maintainer Skill

Implementation-facing companion to `patient-satisfaction-survey-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/patient-satisfaction-survey/` contains:

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

- **Instrument**: Likert-scale satisfaction survey (1-5 per item)
- **Range**: 0-100 (normalized composite score)
- **Categories**:
  - Excellent (85-100): Outstanding patient experience across all domains
  - Good (70-84): Above-average experience with minor improvement areas
  - Satisfactory (50-69): Adequate experience with several improvement areas
  - Poor (25-49): Below-average experience requiring significant improvement
  - Very Poor (0-24): Critically deficient experience requiring urgent action
- **Engine files**: `types.ts`, `grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `grader.test.ts`

## Verify

```sh
bin/test-form patient-satisfaction-survey
bin/test-sql-apply patient-satisfaction-survey
bin/test-personas patient-satisfaction-survey
bin/test-e2e --html patient-satisfaction-survey
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
