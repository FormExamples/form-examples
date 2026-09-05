---
name: grace-score-for-acute-coronary-syndrome-maintainer-skill
description: "Implementation workflow for maintaining and extending the GRACE Score for Acute Coronary Syndrome form (forms/grace-score-for-acute-coronary-syndrome/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# GRACE Score for Acute Coronary Syndrome — Maintainer Skill

Implementation-facing companion to `grace-score-for-acute-coronary-syndrome-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/grace-score-for-acute-coronary-syndrome/` contains:

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

- **Input shape:** `GraceAssessment` TypeScript type — the eight GRACE variable
  inputs (plus creatinine unit) and the context and identification fields.
- **Output shape:**
  ```ts
  gradeGrace(data: GraceAssessment): {
    gracePoints: number;                       // weighted total, ~0..350+
    inHospitalMortalityBand: 'low' | 'intermediate' | 'high';
    sixMonthMortalityBand: 'low' | 'intermediate' | 'high';
    riskCategory: 'low' | 'intermediate' | 'high';
    invasiveStrategy: string;                  // recommendation keyed on riskCategory
    firedContributors: FiredContributor[];     // per-variable point contribution
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted regression point model (see spec §4) — each variable
  maps through a **weighted, banded lookup** (not a simple sum of yes/no items);
  the points are summed into a total, which is read against the in-hospital
  (≤108 / 109–140 / >140) and 6-month (≤88 / 89–118 / >118) mortality bands. The
  overall `riskCategory` is the worse of the two (max-band rule). Serum
  creatinine is normalized to mg/dL (µmol/L ÷ 88.4) before banding. A missing
  numeric input contributes 0 points and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `grace-rules.ts`, `grace-grader.ts`,
  `flagged-issues.ts`.
  - `grace-rules.ts` holds the named per-band point lookup tables (age, heart
    rate, systolic BP, creatinine, Killip, and the three yes/no contributors)
    plus the mortality-band thresholds.
  - `utils.ts` holds creatinine unit normalization and band-lookup helpers.
- **Tests:** `grace-grader.test.ts`, `grace-rules.test.ts` — cover each band
  boundary (age, heart rate, systolic BP, creatinine; Killip I–IV; each yes/no
  contributor), the mortality-band boundaries (108/109, 140/141, 88/89,
  118/119), creatinine unit normalization, and the max-band rule.

## Verify

```sh
bin/test-form grace-score-for-acute-coronary-syndrome
bin/test-sql-apply grace-score-for-acute-coronary-syndrome
bin/test-personas grace-score-for-acute-coronary-syndrome
bin/test-e2e --html grace-score-for-acute-coronary-syndrome
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
