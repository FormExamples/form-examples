---
name: qrisk3-cardiovascular-disease-risk-score-maintainer-skill
description: "Implementation workflow for maintaining and extending the QRISK3 Cardiovascular Disease Risk Score form (forms/qrisk3-cardiovascular-disease-risk-score/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# QRISK3 Cardiovascular Disease Risk Score — Maintainer Skill

Implementation-facing companion to `qrisk3-cardiovascular-disease-risk-score-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/qrisk3-cardiovascular-disease-risk-score/` contains:

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

- **Input shape:** `Qrisk3Assessment` TypeScript type — the model inputs
  (demographics, lifestyle, cardiometabolic, history, medication) plus context,
  identification, and eligibility fields.
- **Output shape:**
  ```ts
  gradeQrisk3(data: Qrisk3Assessment): {
    linearPredictor: number;
    tenYearRiskPercent: number;   // 0.0..99.9, one decimal
    riskBand: 'low' | 'raised' | 'high';
    heartAge: number | null;      // years; null when not computable
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted risk engine (**not** an additive point sum). Select the
  female or male coefficient set by `sex`; centre and fractional-polynomial
  transform the continuous inputs; multiply each transformed value by its fitted
  Cox coefficient and add age-interaction terms to form the linear predictor
  `LP`; then `tenYearRiskPercent = 100 × (1 − S0^exp(LP))` using the model's
  10-year baseline survival `S0`. Band at `>= 10` (`raised`) and `>= 20`
  (`high`). Heart age inverts the risk function with modifiable factors optimal.
  See spec §4. Optional `townsendScore` defaults to the cohort mean; a missing
  required input blocks a valid result and raises a completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `qrisk3-rules.ts` (coefficient tables
  and transforms), `qrisk3-grader.ts` (linear predictor → risk % + heart age),
  `flagged-issues.ts`.
- **Tests:** `qrisk3-grader.test.ts`, `qrisk3-rules.test.ts` — cover the 10 % and
  20 % band boundaries, the male/female model split, the optional Townsend
  default, and the eligibility guards (age 24/25/84/85, established CVD, FH).

## Verify

```sh
bin/test-form qrisk3-cardiovascular-disease-risk-score
bin/test-sql-apply qrisk3-cardiovascular-disease-risk-score
bin/test-personas qrisk3-cardiovascular-disease-risk-score
bin/test-e2e --html qrisk3-cardiovascular-disease-risk-score
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
