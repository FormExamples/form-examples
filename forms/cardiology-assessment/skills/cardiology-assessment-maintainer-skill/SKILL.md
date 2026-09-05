---
name: cardiology-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Cardiology Assessment form (forms/cardiology-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Cardiology Assessment — Maintainer Skill

Implementation-facing companion to `cardiology-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/cardiology-assessment/` contains:

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

- **Instrument**: CCS Angina Classification + NYHA Heart Failure Classification
- **Range**: CCS Angina Class I-IV, NYHA Heart Failure Class I-IV
- **Categories**:
  - CCS I: Angina only with strenuous exertion
  - CCS II: Slight limitation of ordinary activity
  - CCS III: Marked limitation of ordinary activity
  - CCS IV: Angina at rest or with any physical activity
  - NYHA I: No limitation of physical activity
  - NYHA II: Slight limitation; comfortable at rest
  - NYHA III: Marked limitation; comfortable only at rest
  - NYHA IV: Unable to carry on any physical activity without discomfort
- **Engine files**: `types.ts`, `cardio-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `cardio-grader.test.ts`

## Verify

```sh
bin/test-form cardiology-assessment
bin/test-sql-apply cardiology-assessment
bin/test-personas cardiology-assessment
bin/test-e2e --html cardiology-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
