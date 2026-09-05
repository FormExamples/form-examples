---
name: glasgow-blatchford-bleeding-score-maintainer-skill
description: "Implementation workflow for maintaining and extending the Glasgow-Blatchford Bleeding Score (GBS) form (forms/glasgow-blatchford-bleeding-score/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Glasgow-Blatchford Bleeding Score (GBS) — Maintainer Skill

Implementation-facing companion to `glasgow-blatchford-bleeding-score-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/glasgow-blatchford-bleeding-score/` contains:

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

- **Input shape:** `GbsAssessment` TypeScript type — the eight parameter inputs
  plus context and identification fields (including `sex`, which selects the
  haemoglobin band table).
- **Output shape:**
  ```ts
  gradeGbs(data: GbsAssessment): {
    bloodUreaPoints: 0 | 2 | 3 | 4 | 6;
    haemoglobinPoints: 0 | 1 | 3 | 6;
    systolicBloodPressurePoints: 0 | 1 | 2 | 3;
    pulsePoint: 0 | 1;
    melaenaPoint: 0 | 1;
    syncopePoint: 0 | 2;
    hepaticDiseasePoint: 0 | 2;
    cardiacFailurePoint: 0 | 2;
    gbsScore: number; // 0..23
    riskBand: 'very-low' | 'low-moderate' | 'high';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted additive — each parameter contributes points by band
  (see spec §4); the total 0–23 determines the risk band (`0` → `very-low`,
  `1–5` → `low-moderate`, `≥ 6` → `high`). Haemoglobin uses sex-specific bands.
  A missing numeric input contributes 0 points and raises a data-completeness
  flag; unknown sex falls back to the female haemoglobin table.
  - blood urea: <6.5→0, 6.5–7.9→2, 8.0–9.9→3, 10.0–24.9→4, ≥25.0→6
  - haemoglobin (men): ≥130→0, 120–129→1, 100–119→3, <100→6
  - haemoglobin (women): ≥120→0, 100–119→1, <100→6
  - systolic BP: ≥110→0, 100–109→1, 90–99→2, <90→3
  - pulse ≥100→1; melaena→1; syncope→2; hepatic disease→2; cardiac failure→2
- **Engine files:** `types.ts`, `utils.ts`, `gbs-rules.ts`, `gbs-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `gbs-grader.test.ts`, `gbs-rules.test.ts` — cover every band
  boundary (urea 6.4/6.5, 7.9/8.0, 9.9/10.0, 24.9/25.0; Hb 99/100, 119/120,
  129/130 for both sexes; SBP 89/90, 99/100, 109/110; pulse 99/100) and the
  total endpoints 0 and 23.

## Verify

```sh
bin/test-form glasgow-blatchford-bleeding-score
bin/test-sql-apply glasgow-blatchford-bleeding-score
bin/test-personas glasgow-blatchford-bleeding-score
bin/test-e2e --html glasgow-blatchford-bleeding-score
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
