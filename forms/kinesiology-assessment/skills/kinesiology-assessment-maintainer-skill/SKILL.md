---
name: kinesiology-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Kinesiology Assessment form (forms/kinesiology-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Kinesiology Assessment — Maintainer Skill

Implementation-facing companion to `kinesiology-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/kinesiology-assessment/` contains:

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

- **Instrument**: FMS Score
- **Range**: 0-21
- **Categories**: 0-14 = Increased injury risk, 15-17 = Moderate risk, 18-21 = Low risk
- **Engine files**: `types.ts`, `fms-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `fms-grader.test.ts`

## Verify

```sh
bin/test-form kinesiology-assessment
bin/test-sql-apply kinesiology-assessment
bin/test-personas kinesiology-assessment
bin/test-e2e --html kinesiology-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
