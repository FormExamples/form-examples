---
name: four-a-test-for-delirium-maintainer-skill
description: "Implementation workflow for maintaining and extending the 4AT — Rapid Delirium and Cognitive-Impairment Screen form (forms/four-a-test-for-delirium/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# 4AT — Rapid Delirium and Cognitive-Impairment Screen — Maintainer Skill

Implementation-facing companion to `four-a-test-for-delirium-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/four-a-test-for-delirium/` contains:

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

- **Input shape:** `FourATAssessment` TypeScript type mirroring the SQL schema —
  four enum item responses plus identification and context fields.
- **Output shape:**
  ```ts
  scoreFourAT(data: FourATAssessment): {
    item1Score: 0 | 4;         // alertness
    item2Score: 0 | 1 | 2;     // AMT4
    item3Score: 0 | 1 | 2;     // attention (months backwards)
    item4Score: 0 | 4;         // acute change / fluctuating course
    totalScore: number;        // 0..12
    interpretationBand: 'unlikely' | 'possibleCognitiveImpairment' | 'possibleDelirium';
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** sum-of-items. Per-item point map:
  - Item 1 (alertness): `normal` → 0, `mildTransient` → 0, `abnormal` → 4.
  - Item 2 (AMT4): `noMistakes` → 0, `oneMistake` → 1,
    `twoOrMoreOrUntestable` → 2.
  - Item 3 (attention): `sevenOrMore` → 0,
    `startsButUnderSevenOrRefuses` → 1, `untestable` → 2.
  - Item 4 (acute change): `no` → 0, `yes` → 4.
  - `totalScore = item1 + item2 + item3 + item4` (0–12).
  - Band: `>= 4` → `possibleDelirium`; `1–3` → `possibleCognitiveImpairment`;
    `0` → `unlikely`.
- **Engine files:** `types.ts`, `utils.ts`, `fourat-rules.ts`,
  `fourat-grader.ts`, `flagged-issues.ts`.
- **Tests:** `fourat-grader.test.ts`, `fourat-rules.test.ts`.

## Verify

```sh
bin/test-form four-a-test-for-delirium
bin/test-sql-apply four-a-test-for-delirium
bin/test-personas four-a-test-for-delirium
bin/test-e2e --html four-a-test-for-delirium
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
