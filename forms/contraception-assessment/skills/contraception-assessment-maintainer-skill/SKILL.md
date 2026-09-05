---
name: contraception-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Contraception Assessment form (forms/contraception-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Contraception Assessment — Maintainer Skill

Implementation-facing companion to `contraception-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/contraception-assessment/` contains:

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

- **Instrument**: UKMEC (UK Medical Eligibility Criteria)
- **Range**: Categories 1-4
- **Categories**:
  - UKMEC 1: No restriction for use of the contraceptive method
  - UKMEC 2: Advantages of using the method generally outweigh the theoretical or proven risks
  - UKMEC 3: Theoretical or proven risks usually outweigh the advantages of using the method
  - UKMEC 4: Unacceptable health risk if the contraceptive method is used
- **Engine files**: `types.ts`, `ukmec-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `ukmec-grader.test.ts`

## Verify

```sh
bin/test-form contraception-assessment
bin/test-sql-apply contraception-assessment
bin/test-personas contraception-assessment
bin/test-e2e --html contraception-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
