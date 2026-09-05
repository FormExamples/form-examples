---
name: alcohol-use-disorders-identification-test-consumption-maintainer-skill
description: "Implementation workflow for maintaining and extending the Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) form (forms/alcohol-use-disorders-identification-test-consumption/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) — Maintainer Skill

Implementation-facing companion to `alcohol-use-disorders-identification-test-consumption-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/alcohol-use-disorders-identification-test-consumption/` contains:

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

- **Input shape:** `AuditcAssessment` TypeScript type — the three item inputs
  (each an integer 0–4) plus context and identification fields.
- **Output shape:**
  ```ts
  gradeAuditc(data: AuditcAssessment): {
    frequencyOfDrinkingPoint: 0 | 1 | 2 | 3 | 4;
    typicalQuantityPoint: 0 | 1 | 2 | 3 | 4;
    heavyEpisodeFrequencyPoint: 0 | 1 | 2 | 3 | 4;
    auditcScore: number;            // 0..12
    riskBand: 'lower' | 'increasing' | 'higher' | 'possible-dependence';
    firedItems: FiredItem[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each item contributes its own 0–4 point value; the
  total 0–12 determines the risk band (`≥ 5` → positive screen). See spec §4. A
  missing item input contributes 0 points and raises a data-completeness flag.
  - `auditcScore >= 11` → `possible-dependence`
  - `auditcScore >= 8`  → `higher`
  - `auditcScore >= 5`  → `increasing`
  - otherwise           → `lower`
- **Engine files:** `types.ts`, `utils.ts`, `auditc-rules.ts`,
  `auditc-grader.ts`, `flagged-issues.ts`.
- **Tests:** `auditc-grader.test.ts`, `auditc-rules.test.ts` — cover the
  positive-screen boundary (total 4/5), each band boundary (5, 8, 11), and the
  minimum and maximum totals (0 and 12).

## Verify

```sh
bin/test-form alcohol-use-disorders-identification-test-consumption
bin/test-sql-apply alcohol-use-disorders-identification-test-consumption
bin/test-personas alcohol-use-disorders-identification-test-consumption
bin/test-e2e --html alcohol-use-disorders-identification-test-consumption
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
