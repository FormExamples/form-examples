---
name: audio-vestibular-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Audio-Vestibular Assessment form (forms/audio-vestibular-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Audio-Vestibular Assessment — Maintainer Skill

Implementation-facing companion to `audio-vestibular-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/audio-vestibular-assessment/` contains:

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

- **Instrument**: WHO pure-tone audiometry grades + Dizziness Handicap Inventory
- **Range**: Normal / Mild / Moderate / Moderately Severe / Severe / Profound; DHI 0-100
- **Engine files**: `types.ts`, `audio-vestibular-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `audio-vestibular-grader.test.ts`

## Verify

```sh
bin/test-form audio-vestibular-assessment
bin/test-sql-apply audio-vestibular-assessment
bin/test-personas audio-vestibular-assessment
bin/test-e2e --html audio-vestibular-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
