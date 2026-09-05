---
name: medical-error-report-maintainer-skill
description: "Implementation workflow for maintaining and extending the Medical Error Report form (forms/medical-error-report/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Medical Error Report — Maintainer Skill

Implementation-facing companion to `medical-error-report-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/medical-error-report/` contains:

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

- **Instrument**: WHO Severity Scale + NCC MERP Harm Categories
- **WHO Severity Scale**: Near Miss, Mild, Moderate, Severe, Critical
- **NCC MERP Categories**: A through I
- **Engine files**: `types.ts`, `error-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `error-grader.test.ts`

## Verify

```sh
bin/test-form medical-error-report
bin/test-sql-apply medical-error-report
bin/test-personas medical-error-report
bin/test-e2e --html medical-error-report
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
