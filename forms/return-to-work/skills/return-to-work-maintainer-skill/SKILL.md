---
name: return-to-work-maintainer-skill
description: "Implementation workflow for maintaining and extending the Return to Work form (forms/return-to-work/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Return to Work — Maintainer Skill

Implementation-facing companion to `return-to-work-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/return-to-work/` contains:

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

## Scoring engine

- **Input shape:** `ReturnToWorkAssessment` TypeScript type containing
  patient, clinician, job-context, absence, diagnosis, treatment,
  functional, fitness-statement, phased-return, adjustment, follow-up,
  and sign-off sub-types.
- **Output shape:**
  ```ts
  calculateReturnToWork(data: ReturnToWorkAssessment): {
    fitnessStatement: 'fit' | 'may-be-fit' | 'not-fit';
    restrictionPriority: 'routine' | 'standard' | 'restricted' | 'high-risk';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the most severe adjustment sets the
  restriction priority; safety flags fire independently.
- **Engine files:** `types.ts`, `utils.ts`, `fitness-rules.ts`,
  `restriction-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `restriction-rules.test.ts`.

## Verify

```sh
bin/test-form return-to-work
bin/test-sql-apply return-to-work
bin/test-personas return-to-work
bin/test-e2e --html return-to-work
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
