---
name: centor-score-for-streptococcal-pharyngitis-maintainer-skill
description: "Implementation workflow for maintaining and extending the Centor Score for Streptococcal Pharyngitis form (forms/centor-score-for-streptococcal-pharyngitis/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Centor Score for Streptococcal Pharyngitis — Maintainer Skill

Implementation-facing companion to `centor-score-for-streptococcal-pharyngitis-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/centor-score-for-streptococcal-pharyngitis/` contains:

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

- **Input shape:** `CentorAssessment` TypeScript type — the four criterion
  inputs, optional measured temperature, patient age, plus context,
  identification, and red-flag fields.
- **Output shape:**
  ```ts
  gradeCentor(data: CentorAssessment): {
    tonsillarExudatePoint: 0 | 1;
    tenderNodesPoint: 0 | 1;
    feverPoint: 0 | 1;
    coughAbsentPoint: 0 | 1;
    centorScore: 0 | 1 | 2 | 3 | 4;
    ageModifier: -1 | 0 | 1;
    mcIsaacScore: number; // -1..5
    riskBand: 'low' | 'moderate' | 'high';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each criterion contributes 0 or 1; the Centor total
  0–4 plus the McIsaac age modifier gives the modified score −1 to 5, which
  determines the risk band (`≤ 1` → low, `2–3` → moderate, `4–5` → high). See
  spec §4.
  - tonsillar exudate = yes → 1
  - tender anterior cervical nodes = yes → 1
  - fever = yes, or measured temperature > 38 °C → 1
  - cough absent = yes → 1
  - age 3–14 → +1; 15–44 → 0; ≥ 45 → −1 (missing age → 0)
- **Engine files:** `types.ts`, `utils.ts`, `centor-rules.ts`,
  `centor-grader.ts`, `flagged-issues.ts`.
- **Tests:** `centor-grader.test.ts`, `centor-rules.test.ts` — cover the fever
  boundary (38.0/38.1 °C), each age-modifier boundary (2/3, 14/15, 44/45 years),
  every Centor total 0–4, and the full McIsaac range −1 to 5.

## Verify

```sh
bin/test-form centor-score-for-streptococcal-pharyngitis
bin/test-sql-apply centor-score-for-streptococcal-pharyngitis
bin/test-personas centor-score-for-streptococcal-pharyngitis
bin/test-e2e --html centor-score-for-streptococcal-pharyngitis
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
