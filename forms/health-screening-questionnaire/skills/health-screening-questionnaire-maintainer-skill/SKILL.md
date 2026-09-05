---
name: health-screening-questionnaire-maintainer-skill
description: "Implementation workflow for maintaining and extending the Health Screening Questionnaire form (forms/health-screening-questionnaire/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Health Screening Questionnaire — Maintainer Skill

Implementation-facing companion to `health-screening-questionnaire-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/health-screening-questionnaire/` contains:

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

- **Input shape:** `HealthScreeningQuestionnaire` TypeScript type containing
  the 14 wizard sections plus assessor-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateHealthScreening(data: HealthScreeningQuestionnaire): {
    parqPlusClearance: 'cleared' | 'further-assessment-required';
    auditCScore: number | null;                          // 0..12
    auditCBand: 'low' | 'increasing-risk' | 'higher-risk' | '';
    computedRiskBand: 'low' | 'moderate' | 'high' | 'refer-urgently';
    finalRiskBand: 'low' | 'moderate' | 'high' | 'refer-urgently' | '';
    computedRecommendation: Recommendation;
    finalRecommendation: Recommendation;
    overrideReason: string;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** max-grade — the worst finding sets the composite risk band;
  safety flags fire independently of the risk band. `low` is the default when
  no rule fires.
- **Engine files (HTML):** `js/types.js`, `js/parq-rules.js`,
  `js/audit-c-rules.js`, `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `parq-rules.ts`,
  `audit-c-rules.ts`, `flagged-issues.ts`, `grader.ts`), with
  `grader.test.ts` asserting both sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Verify

```sh
bin/test-form health-screening-questionnaire
bin/test-sql-apply health-screening-questionnaire
bin/test-examples-conformance health-screening-questionnaire
bin/lily-html-refactor --check health-screening-questionnaire
bin/test-personas health-screening-questionnaire
bin/test-e2e --html health-screening-questionnaire
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
