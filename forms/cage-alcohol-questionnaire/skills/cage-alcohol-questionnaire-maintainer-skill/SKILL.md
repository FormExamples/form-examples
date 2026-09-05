---
name: cage-alcohol-questionnaire-maintainer-skill
description: "Implementation workflow for maintaining and extending the CAGE Alcohol Questionnaire form (forms/cage-alcohol-questionnaire/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# CAGE Alcohol Questionnaire — Maintainer Skill

Implementation-facing companion to `cage-alcohol-questionnaire-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/cage-alcohol-questionnaire/` contains:

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

- **Input shape:** `CageAssessment` TypeScript type — the four criterion inputs
  plus context and identification fields.
- **Output shape:**
  ```ts
  gradeCage(data: CageAssessment): {
    cutDownPoint: 0 | 1;
    annoyedPoint: 0 | 1;
    guiltyPoint: 0 | 1;
    eyeOpenerPoint: 0 | 1;
    cageScore: 0 | 1 | 2 | 3 | 4;
    resultBand: 'negative' | 'low' | 'positive';
    positiveItems: PositiveItem[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each item scores 1 for `'yes'` and 0 otherwise; the
  total 0–4 determines the result band (`≥ 2` → `positive`, `1` → `low`,
  `0` → `negative`). See spec §4. An unanswered item (`''`) contributes 0 points
  and raises a data-completeness flag.
  - cutDown == 'yes' → 1
  - annoyed == 'yes' → 1
  - guilty == 'yes' → 1
  - eyeOpener == 'yes' → 1
- **Engine files:** `types.ts`, `utils.ts`, `cage-rules.ts`, `cage-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `cage-grader.test.ts`, `cage-rules.test.ts` — cover each item's
  yes/no contribution, every total 0–4, and the threshold boundary (score 1 vs 2).

## Verify

```sh
bin/test-form cage-alcohol-questionnaire
bin/test-sql-apply cage-alcohol-questionnaire
bin/test-personas cage-alcohol-questionnaire
bin/test-e2e --html cage-alcohol-questionnaire
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
