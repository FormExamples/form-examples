---
name: medical-information-form-for-air-travel-maintainer-skill
description: "Implementation workflow for maintaining and extending the Medical Information Form for Air Travel (MEDIF) form (forms/medical-information-form-for-air-travel/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Medical Information Form for Air Travel (MEDIF) — Maintainer Skill

Implementation-facing companion to `medical-information-form-for-air-travel-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/medical-information-form-for-air-travel/` contains:

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

- **Input shape:** `MedifAssessment` TypeScript type containing trip details,
  passenger identity, attending-physician identity, 7 clinical sections
  (cardiovascular, respiratory, recent-event, pregnancy, communicable,
  in-flight-needs, medications) and the requested accommodations.
- **Output shape:**
  ```ts
  evaluateFitnessToFly(data: MedifAssessment): {
    fitnessBand: 'fit' | 'fit-with-conditions' | 'requires-review' | 'unfit-to-fly';
    firedRules: FiredRule[];
    safetyFlags: SafetyFlag[];
    deskRecommendation: string;
    validUntil: string; // ISO 8601 date
  }
  ```
- **Algorithm:** max-grade — the worst-band finding sets the overall
  fitness band; `fit` is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `equipment-rules.ts`,
  `recent-event-rules.ts`, `cardiorespiratory-rules.ts`, `pregnancy-rules.ts`,
  `communicable-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `recent-event-rules.test.ts`,
  `cardiorespiratory-rules.test.ts`, `pregnancy-rules.test.ts`.

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
bin/test-sql-apply medical-information-form-for-air-travel
bin/test-personas medical-information-form-for-air-travel
bin/test-e2e --html medical-information-form-for-air-travel
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
