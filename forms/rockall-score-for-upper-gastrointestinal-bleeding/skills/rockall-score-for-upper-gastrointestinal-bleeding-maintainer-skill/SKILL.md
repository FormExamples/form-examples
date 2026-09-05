---
name: rockall-score-for-upper-gastrointestinal-bleeding-maintainer-skill
description: "Implementation workflow for maintaining and extending the Rockall Score for Upper Gastrointestinal Bleeding form (forms/rockall-score-for-upper-gastrointestinal-bleeding/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Rockall Score for Upper Gastrointestinal Bleeding — Maintainer Skill

Implementation-facing companion to `rockall-score-for-upper-gastrointestinal-bleeding-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/rockall-score-for-upper-gastrointestinal-bleeding/` contains:

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

- **Input shape:** `RockallAssessment` TypeScript type — the clinical and
  endoscopic parameter inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeRockall(data: RockallAssessment): {
    agePoints: 0 | 1 | 2;
    shockPoints: 0 | 1 | 2;
    comorbidityPoints: 0 | 2 | 3;
    clinicalRockallScore: number;      // 0..7
    diagnosisPoints: 0 | 1 | 2;
    stigmataPoints: 0 | 2;
    fullRockallScore: number | null;   // 0..11 or null (no endoscopy)
    riskBand: 'low' | 'intermediate' | 'high' | 'clinical-only';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive per parameter (see spec §4).
  - age: `< 60 → 0`, `60–79 → 1`, `≥ 80 → 2`
  - shock: `SBP < 100 → 2`, else `HR ≥ 100 → 1`, else `0`
  - comorbidity: `none → 0`, `major → 2`, `severe → 3`
  - clinical score = age + shock + comorbidity (0–7)
  - diagnosis: `mallory-weiss-or-none → 0`, `all-other → 1`, `upper-gi-malignancy → 2`
  - stigmata: `none-or-dark-spot → 0`, `high-risk → 2`
  - full score (only when `endoscopyPerformed == 'yes'`) = clinical + diagnosis + stigmata (0–11)
  - band from full score (`≤ 2 low`, `3–4 intermediate`, `≥ 5 high`), else `clinical-only` (clinical 0 → `low`)
- **Engine files:** `types.ts`, `utils.ts`, `rockall-rules.ts`,
  `rockall-grader.ts`, `flagged-issues.ts`.
- **Tests:** `rockall-grader.test.ts`, `rockall-rules.test.ts` — cover each
  threshold boundary (age 59/60/79/80, HR 99/100, SBP 99/100), every enum value,
  and the clinical-only vs full path.

## Verify

```sh
bin/test-form rockall-score-for-upper-gastrointestinal-bleeding
bin/test-sql-apply rockall-score-for-upper-gastrointestinal-bleeding
bin/test-personas rockall-score-for-upper-gastrointestinal-bleeding
bin/test-e2e --html rockall-score-for-upper-gastrointestinal-bleeding
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
