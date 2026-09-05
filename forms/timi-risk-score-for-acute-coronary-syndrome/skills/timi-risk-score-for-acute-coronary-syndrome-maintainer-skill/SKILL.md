---
name: timi-risk-score-for-acute-coronary-syndrome-maintainer-skill
description: "Implementation workflow for maintaining and extending the TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI) form (forms/timi-risk-score-for-acute-coronary-syndrome/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI) — Maintainer Skill

Implementation-facing companion to `timi-risk-score-for-acute-coronary-syndrome-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/timi-risk-score-for-acute-coronary-syndrome/` contains:

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

- **Input shape:** `TimiAssessment` TypeScript type — the seven criterion inputs
  (age plus the risk-factor and clinical yes/no flags) plus context and
  identification fields.
- **Output shape:**
  ```ts
  gradeTimi(data: TimiAssessment): {
    agePoint: 0 | 1;
    riskFactorCount: 0 | 1 | 2 | 3 | 4 | 5;
    riskFactorPoint: 0 | 1;
    knownCadPoint: 0 | 1;
    aspirinPoint: 0 | 1;
    anginaPoint: 0 | 1;
    stDeviationPoint: 0 | 1;
    cardiacMarkerPoint: 0 | 1;
    timiScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    riskBand: 'low' | 'intermediate' | 'high';
    fourteenDayRiskPercent: number;
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each of the seven criteria contributes 0 or 1; the
  total 0–7 determines the band (`≤ 1` low, `2–4` intermediate, `≥ 5` high) and a
  lookup of the 14-day composite-event risk. See spec §4. Criterion 2 fires when
  **≥ 3** of the five risk factors are `yes`. A missing input counts as absent
  (0 points) and raises a data-completeness flag.
  - age ≥ 65 → 1
  - ≥ 3 of {hypertension, hypercholesterolaemia, diabetes, current smoking,
    family history of premature CAD} → 1
  - known CAD (stenosis ≥ 50%) → 1
  - aspirin in prior 7 days → 1
  - ≥ 2 anginal episodes in 24 h → 1
  - ST deviation ≥ 0.5 mm → 1
  - positive cardiac marker (troponin / CK-MB) → 1
- **Engine files:** `types.ts`, `utils.ts`, `timi-rules.ts`, `timi-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `timi-grader.test.ts`, `timi-rules.test.ts` — cover the age
  boundary (64/65), the risk-factor threshold (2/3 factors), each band
  transition (1→2, 4→5), and every total 0–7 with its mapped 14-day risk.

## Verify

```sh
bin/test-form timi-risk-score-for-acute-coronary-syndrome
bin/test-sql-apply timi-risk-score-for-acute-coronary-syndrome
bin/test-personas timi-risk-score-for-acute-coronary-syndrome
bin/test-e2e --html timi-risk-score-for-acute-coronary-syndrome
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
