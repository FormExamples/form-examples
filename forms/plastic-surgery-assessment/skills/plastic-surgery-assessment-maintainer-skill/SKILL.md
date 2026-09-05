---
name: plastic-surgery-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Plastic Surgery Assessment form (forms/plastic-surgery-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Plastic Surgery Assessment — Maintainer Skill

Implementation-facing companion to `plastic-surgery-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/plastic-surgery-assessment/` contains:

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

- **Instrument**: ASA Physical Status Classification + Wound Classification + Surgical Complexity Scoring
- **Range**: ASA I-V, Wound Class I-IV, Complexity 1-4
- **Categories**:
  - ASA I: Normal healthy patient
  - ASA II: Patient with mild systemic disease
  - ASA III: Patient with severe systemic disease
  - ASA IV: Patient with severe systemic disease that is a constant threat to life
  - ASA V: Moribund patient not expected to survive without the operation
- **Engine files**: `types.ts`, `plastics-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `plastics-grader.test.ts`

## Verify

```sh
bin/test-form plastic-surgery-assessment
bin/test-sql-apply plastic-surgery-assessment
bin/test-personas plastic-surgery-assessment
bin/test-e2e --html plastic-surgery-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
