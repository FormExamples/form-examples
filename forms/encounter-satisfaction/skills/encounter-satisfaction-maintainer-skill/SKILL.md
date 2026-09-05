---
name: encounter-satisfaction-maintainer-skill
description: "Implementation workflow for maintaining and extending the Encounter Satisfaction form (forms/encounter-satisfaction/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Encounter Satisfaction — Maintainer Skill

Implementation-facing companion to `encounter-satisfaction-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/encounter-satisfaction/` contains:

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

- **Instrument**: Encounter Satisfaction Score (ESS), inspired by PSQ-18 and HCAHPS
- **Scale**: 5-point Likert (1=Very Dissatisfied ... 5=Very Satisfied), `null` when unanswered
- **Range**: 1.0 - 5.0 (composite mean of all answered questions)
- **19 questions across 6 domains**:
  - Access & Scheduling (3 questions)
  - Communication (4 questions)
  - Staff & Professionalism (3 questions)
  - Care Quality (3 questions)
  - Environment (3 questions)
  - Overall Satisfaction (3 questions)
- **Categories**:
  - 4.5 - 5.0: Excellent
  - 3.5 - 4.4: Good
  - 2.5 - 3.4: Fair
  - 1.5 - 2.4: Poor
  - 1.0 - 1.4: Very Poor
- **Engine files**: `types.ts`, `satisfaction-grader.ts`, `satisfaction-questions.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `satisfaction-grader.test.ts`

## Verify

```sh
bin/test-form encounter-satisfaction
bin/test-sql-apply encounter-satisfaction
bin/test-personas encounter-satisfaction
bin/test-e2e --html encounter-satisfaction
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
