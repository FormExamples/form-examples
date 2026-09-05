---
name: dietic-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Dietetic Assessment form (forms/dietic-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Dietetic Assessment — Maintainer Skill

Implementation-facing companion to `dietic-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/dietic-assessment/` contains:

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

- **Input shape:** `DieticAssessment` TypeScript type containing the 16 wizard
  sections plus dietitian-identification and patient-identification fields.
- **Output shape:**

  ```ts
  calculateNutritionRisk(data: DieticAssessment): {
    mustBmiScore: 0 | 1 | 2;
    mustWeightLossScore: 0 | 1 | 2;
    mustAcuteDiseaseScore: 0 | 2;
    mustScore: number;                                   // 0..6
    mustRisk: 'low' | 'medium' | 'high';
    glimPhenotypicCriteria: string[];
    glimEtiologicCriteria: string[];
    glimDiagnosis: 'none' | 'moderate' | 'severe';
    nrs2002Score: number | null;                         // 0..7
    sarcfScore: number | null;                           // 0..10
    scoffScore: number | null;                           // 0..5
    refeedingRisk: 'none' | 'high' | 'highest';
    energyRequirementKcal: number | null;
    proteinRequirementG: number | null;
    computedCompositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    finalCompositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    overrideReason: string;
    recommendation: Recommendation;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** max-grade — the worst finding sets the composite risk band;
  safety flags fire independently of the MUST score. `low` is the default when
  no rule fires.
- **Engine files (HTML):** `js/types.js`, `js/must-rules.js`,
  `js/glim-rules.js`, `js/composite-grader.js`, `js/flagged-issues.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `must-rules.ts`,
  `glim-rules.ts`, `flagged-issues.ts`, `grader.ts`), with `grader.test.ts`
  asserting both sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Verify

```sh
bin/test-form dietic-assessment
bin/test-sql-apply dietic-assessment
bin/test-examples-conformance dietic-assessment
bin/lily-html-refactor --check dietic-assessment
bin/test-personas dietic-assessment
bin/test-e2e --html dietic-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
