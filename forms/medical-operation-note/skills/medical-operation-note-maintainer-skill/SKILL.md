---
name: medical-operation-note-maintainer-skill
description: "Implementation workflow for maintaining and extending the Medical Operation Note form (forms/medical-operation-note/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Medical Operation Note — Maintainer Skill

Implementation-facing companion to `medical-operation-note-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/medical-operation-note/` contains:

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

- **Input shape:** `OperationNote` TypeScript type containing
  identification, team, diagnoses, procedures, anaesthesia, approach,
  technique, materials, drains, specimens, counts, EBL, complications,
  and post-op plan sub-types.
- **Output shape:**
  ```ts
  calculateOperationGrade(data: OperationNote): {
    compositeRisk: 'routine' | 'complicated' | 'high-risk' | 'critical';
    clavienDindoGrade: '0' | 'I' | 'II' | 'IIIa' | 'IIIb' | 'IVa' | 'IVb' | 'V';
    asaPhysicalStatus: 1 | 2 | 3 | 4 | 5 | 6 | null;
    bloodLossBand: 'minimal' | 'mild' | 'moderate' | 'severe' | 'massive';
    countsAgreed: boolean;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst finding sets the composite grade;
  Routine is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `composite-grader.ts`,
  `clavien-dindo-rules.ts`, `blood-loss-rules.ts`, `count-rules.ts`,
  `never-event-rules.ts`, `anaesthetic-event-rules.ts`,
  `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `clavien-dindo-rules.test.ts`,
  `count-rules.test.ts`.

## Verify

```sh
bin/test-form medical-operation-note
bin/test-sql-apply medical-operation-note
bin/test-personas medical-operation-note
bin/test-e2e --html medical-operation-note
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
