---
name: pre-anaesthesia-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Pre-Anaesthesia Assessment form (forms/pre-anaesthesia-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Pre-Anaesthesia Assessment — Maintainer Skill

Implementation-facing companion to `pre-anaesthesia-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/pre-anaesthesia-assessment/` contains:

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
    compositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst finding sets the composite grade; ASA I
  is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `asa-rules.ts`, `mallampati-rules.ts`,
  `rcri-rules.ts`, `stopbang-rules.ts`, `frailty-rules.ts`, `composite-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `asa-rules.test.ts`.

## Verify

```sh
bin/test-form pre-anaesthesia-assessment
bin/test-sql-apply pre-anaesthesia-assessment
bin/test-personas pre-anaesthesia-assessment
bin/test-e2e --html pre-anaesthesia-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
