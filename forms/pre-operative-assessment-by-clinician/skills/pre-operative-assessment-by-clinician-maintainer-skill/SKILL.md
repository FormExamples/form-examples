---
name: pre-operative-assessment-by-clinician-maintainer-skill
description: "Implementation workflow for maintaining and extending the Pre-operative Assessment by Clinician form (forms/pre-operative-assessment-by-clinician/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Pre-operative Assessment by Clinician — Maintainer Skill

Implementation-facing companion to `pre-operative-assessment-by-clinician-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/pre-operative-assessment-by-clinician/` contains:

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

- **Input shape:** `ClinicianAssessment` TypeScript type containing 11
  body-system sub-types plus surgical, anaesthesia-plan, and clinician-
  identification fields.
- **Output shape:**
  ```ts
  calculateASA(data: ClinicianAssessment): {
    asaGrade: 1 | 2 | 3 | 4 | 5 | 6;
    mallampatiClass: 1 | 2 | 3 | 4 | null;
    rcriScore: number;    // 0..6
    stopBangScore: number; // 0..8
    frailtyScale: number | null; // 1..9
    friedPhenotypeScore: number | null; // 0..5
    friedFrailtyCategory: 'robust' | 'pre-frail' | 'frail' | '';
    compositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst finding sets the composite grade; ASA I
  is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `asa-rules.ts`, `mallampati-rules.ts`,
  `rcri-rules.ts`, `stopbang-rules.ts`, `frailty-rules.ts` (also exports
  `computeFriedPhenotypeScore()`), `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `asa-rules.test.ts`.

## Verify

```sh
bin/test-form pre-operative-assessment-by-clinician
bin/test-sql-apply pre-operative-assessment-by-clinician
bin/test-personas pre-operative-assessment-by-clinician
bin/test-e2e --html pre-operative-assessment-by-clinician
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
