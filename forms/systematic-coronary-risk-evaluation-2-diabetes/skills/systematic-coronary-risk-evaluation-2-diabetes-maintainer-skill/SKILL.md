---
name: systematic-coronary-risk-evaluation-2-diabetes-maintainer-skill
description: "Implementation workflow for maintaining and extending the SCORE2-Diabetes form (forms/systematic-coronary-risk-evaluation-2-diabetes/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# SCORE2-Diabetes — Maintainer Skill

Implementation-facing companion to `systematic-coronary-risk-evaluation-2-diabetes-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/systematic-coronary-risk-evaluation-2-diabetes/` contains:

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

- **Instrument**: SCORE2-Diabetes (ESC 2023)
- **Range**: 10-year CVD risk as percentage
- **Age-modified thresholds**: Low / moderate (< 5 %), High (5 - < 10 % / < 7.5 %), Very high (≥ 10 % / ≥ 7.5 %) — depending on age band
- **Engine files**: `types.ts`, `score2-grader.ts`, `score2-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `score2-grader.test.ts`

## Verify

```sh
bin/test-form systematic-coronary-risk-evaluation-2-diabetes
bin/test-sql-apply systematic-coronary-risk-evaluation-2-diabetes
bin/test-personas systematic-coronary-risk-evaluation-2-diabetes
bin/test-e2e --html systematic-coronary-risk-evaluation-2-diabetes
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
