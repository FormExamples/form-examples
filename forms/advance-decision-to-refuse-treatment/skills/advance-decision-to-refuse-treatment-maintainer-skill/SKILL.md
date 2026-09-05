---
name: advance-decision-to-refuse-treatment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Advance Decision to Refuse Treatment form (forms/advance-decision-to-refuse-treatment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Advance Decision to Refuse Treatment — Maintainer Skill

Implementation-facing companion to `advance-decision-to-refuse-treatment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/advance-decision-to-refuse-treatment/` contains:

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

- **Instrument**: Validity Check
- **Range**: Three-level categorical
- **Categories**: Valid, Invalid, Incomplete
- **Engine files**: `types.ts`, `validity-grader.ts`, `validity-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `validity-grader.test.ts`

## Verify

```sh
bin/test-form advance-decision-to-refuse-treatment
bin/test-sql-apply advance-decision-to-refuse-treatment
bin/test-personas advance-decision-to-refuse-treatment
bin/test-e2e --html advance-decision-to-refuse-treatment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
