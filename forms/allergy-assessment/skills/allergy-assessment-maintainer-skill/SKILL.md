---
name: allergy-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Allergy Assessment form (forms/allergy-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Allergy Assessment — Maintainer Skill

Implementation-facing companion to `allergy-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/allergy-assessment/` contains:

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

- **Instrument**: Allergy Severity
- **Range**: Four-level categorical (Low, Moderate, High, Critical)
- **Categories**: Low (mild localized reactions only), Moderate (systemic but non-life-threatening reactions), High (severe reactions or multiple allergen categories), Critical (history of anaphylaxis or life-threatening reactions)
- **Engine files**: `types.ts`, `allergy-grader.ts`, `allergy-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `allergy-grader.test.ts`

## Verify

```sh
bin/test-form allergy-assessment
bin/test-sql-apply allergy-assessment
bin/test-personas allergy-assessment
bin/test-e2e --html allergy-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
