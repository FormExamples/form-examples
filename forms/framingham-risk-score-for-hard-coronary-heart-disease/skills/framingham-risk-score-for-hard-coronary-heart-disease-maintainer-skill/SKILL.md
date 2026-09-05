---
name: framingham-risk-score-for-hard-coronary-heart-disease-maintainer-skill
description: "Implementation workflow for maintaining and extending the Framingham Risk Score for Hard Coronary Heart Disease form (forms/framingham-risk-score-for-hard-coronary-heart-disease/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Framingham Risk Score for Hard Coronary Heart Disease — Maintainer Skill

Implementation-facing companion to `framingham-risk-score-for-hard-coronary-heart-disease-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/framingham-risk-score-for-hard-coronary-heart-disease/` contains:

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

- **Instrument**: Framingham Hard CHD Risk Score (Wilson 1998 / ATP III)
- **Range**: 10-year risk as percentage (< 1 % - 30 %+)
- **Categories**:
  - Low: < 10 %
  - Moderate: 10 - < 20 %
  - High: ≥ 20 %
- **Engine files**: `types.ts`, `framingham-grader.ts`, `framingham-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `framingham-grader.test.ts`

## Verify

```sh
bin/test-form framingham-risk-score-for-hard-coronary-heart-disease
bin/test-sql-apply framingham-risk-score-for-hard-coronary-heart-disease
bin/test-personas framingham-risk-score-for-hard-coronary-heart-disease
bin/test-e2e --html framingham-risk-score-for-hard-coronary-heart-disease
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
