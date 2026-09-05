---
name: predicting-risk-of-cardiovascular-disease-events-maintainer-skill
description: "Implementation workflow for maintaining and extending the Predicting Risk of Cardiovascular Disease Events (PREVENT) form (forms/predicting-risk-of-cardiovascular-disease-events/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Predicting Risk of Cardiovascular Disease Events (PREVENT) — Maintainer Skill

Implementation-facing companion to `predicting-risk-of-cardiovascular-disease-events-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/predicting-risk-of-cardiovascular-disease-events/` contains:

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

- **Instrument**: AHA PREVENT equations (2023)
- **Range**: 10-year and 30-year risk as percentages (0.0-100.0%)
- **Predicted outcomes**: total CVD, atherosclerotic CVD (ASCVD), heart failure (HF)
- **Categories** (10-year total CVD): Low (< 5 %), Borderline (5 - < 7.5 %), Intermediate (7.5 - < 20 %), High (≥ 20 %)
- **Engine files**: `types.ts`, `prevent-grader.ts`, `prevent-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `prevent-grader.test.ts`

## Verify

```sh
bin/test-form predicting-risk-of-cardiovascular-disease-events
bin/test-sql-apply predicting-risk-of-cardiovascular-disease-events
bin/test-personas predicting-risk-of-cardiovascular-disease-events
bin/test-e2e --html predicting-risk-of-cardiovascular-disease-events
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
