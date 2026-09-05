---
name: post-operative-report-maintainer-skill
description: "Implementation workflow for maintaining and extending the Post-Operative Report form (forms/post-operative-report/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Post-Operative Report — Maintainer Skill

Implementation-facing companion to `post-operative-report-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/post-operative-report/` contains:

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

- **Instrument**: Clavien-Dindo Classification of Surgical Complications
- **Range**: Grade 0 through Grade V
- **Categories**: See index.md for full grade definitions
- **Engine files**: `types.ts`, `clavien-dindo-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `clavien-dindo-grader.test.ts`

## Verify

```sh
bin/test-form post-operative-report
bin/test-sql-apply post-operative-report
bin/test-personas post-operative-report
bin/test-e2e --html post-operative-report
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
