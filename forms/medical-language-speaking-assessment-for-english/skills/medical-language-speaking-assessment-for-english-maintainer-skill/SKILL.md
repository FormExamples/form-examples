---
name: medical-language-speaking-assessment-for-english-maintainer-skill
description: "Implementation workflow for maintaining and extending the Medical Language Speaking Assessment for English form (forms/medical-language-speaking-assessment-for-english/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Medical Language Speaking Assessment for English — Maintainer Skill

Implementation-facing companion to `medical-language-speaking-assessment-for-english-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/medical-language-speaking-assessment-for-english/` contains:

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

- **Instrument**: OET Speaking Sub-test (Medicine profession)
- **Range**: 0-500 (grades A, B, C+, C, D, E)
- **Linguistic criteria**: Intelligibility, Fluency, Appropriateness of Language, Resources of Grammar & Expression
- **Clinical communication indicators**: Relationship-building, Understanding patient's perspective, Providing structure, Information-gathering, Information-giving
- **Engine files**: `types.ts`, `oet-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `oet-grader.test.ts`

## Verify

```sh
bin/test-form medical-language-speaking-assessment-for-english
bin/test-sql-apply medical-language-speaking-assessment-for-english
bin/test-personas medical-language-speaking-assessment-for-english
bin/test-e2e --html medical-language-speaking-assessment-for-english
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
