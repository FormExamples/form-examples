---
name: glasgow-coma-scale-maintainer-skill
description: "Implementation workflow for maintaining and extending the Glasgow Coma Scale form (forms/glasgow-coma-scale/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Glasgow Coma Scale — Maintainer Skill

Implementation-facing companion to `glasgow-coma-scale-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/glasgow-coma-scale/` contains:

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

Pure, deterministic function over the assessment. No side effects, no I/O.

- **Input shape:**
  ```ts
  interface GcsAssessment {
    // context
    assessedAt: string | null;        // ISO 8601 datetime
    assessorName: string;             // '' if unanswered
    assessorRole: string;             // '' if unanswered
    setting: string;                  // 'ed' | 'neuro' | 'critical-care' | 'pre-hospital' | ''
    // components — score is null when not testable; the NT flag records why
    eyeScore: number | null;          // 1..4
    eyeNotTestable: boolean;
    verbalScore: number | null;       // 1..5
    verbalNotTestable: boolean;
    motorScore: number | null;        // 1..6
    motorNotTestable: boolean;
    // confounders (each may justify an NT)
    intubated: boolean;
    sedated: boolean;
    paralysed: boolean;
    // pupils — for GCS-P
    leftPupilReactive: boolean | null;
    rightPupilReactive: boolean | null;
    // trend
    previousTotal: number | null;     // 3..15
    previousMotorScore: number | null;// 1..6
  }
  ```
- **Output shape:**
  ```ts
  calculateGcs(data: GcsAssessment): {
    eyeScore: number | null;          // 1..4
    verbalScore: number | null;       // 1..5
    motorScore: number | null;        // 1..6
    total: number | null;             // 3..15; null if any component NT
    breakdown: string;                // e.g. "E3 V4 M5" or "E3 V-NT M5"
    totalDisplay: string;             // e.g. "12" or "9T" (intubated verbal)
    severityBand: 'mild' | 'moderate' | 'severe' | null;
    pupilReactivityScore: number | null; // 0..2 (pupils unreactive to light)
    gcsP: number | null;              // 1..15 = total − PRS; null if undefined
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:**
  1. Resolve each component score, or `null` when its NT flag is set.
  2. `total = eye + verbal + motor` only when all three are testable; otherwise
     `null` and `severityBand = null`.
  3. Band the defined total: 13–15 `mild`, 9–12 `moderate`, 3–8 `severe`.
  4. `pupilReactivityScore` = count of pupils unreactive to light (0–2), when
     both pupils are examined.
  5. `gcsP = total − pupilReactivityScore` when both `total` and PRS are defined.
  6. Evaluate rules (§ flagged issues) and collect fired rules and flags.
- **Engine files:** `types.ts`, `gcs-rules.ts`, `gcs-grader.ts`,
  `flagged-issues.ts`, `utils.ts`.
- **Tests:** `gcs-grader.test.ts`, `flagged-issues.test.ts`.

## Verify

```sh
bin/test-form glasgow-coma-scale
bin/test-sql-apply glasgow-coma-scale
bin/test-personas glasgow-coma-scale
bin/test-e2e --html glasgow-coma-scale
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
