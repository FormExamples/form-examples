---
name: confusion-assessment-method-maintainer-skill
description: "Implementation workflow for maintaining and extending the Confusion Assessment Method (CAM) form (forms/confusion-assessment-method/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Confusion Assessment Method (CAM) — Maintainer Skill

Implementation-facing companion to `confusion-assessment-method-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/confusion-assessment-method/` contains:

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

This form **classifies**; it does not sum. The engine is a pure boolean
function of four present / absent features.

- **Input shape:** `CamAssessment` TypeScript type — four features plus
  identification, variant, consciousness level, RASS, attention test, motoric
  subtype, and observation notes.
- **Output shape:**
  ```ts
  gradeCam(data: CamAssessment): {
    classification: 'present' | 'absent' | 'unableToAssess';
    deliriumPresent: boolean;
    positiveFeatures: number[];        // subset of [1,2,3,4]
    motoricSubtype: 'hypoactive' | 'hyperactive' | 'mixed' | 'normal' | '';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:**
  ```
  deliriumPresent = feature1 AND feature2 AND (feature3 OR feature4)
  ```
  where feature1 = acute onset and fluctuating course, feature2 = inattention,
  feature3 = disorganized thinking, feature4 = altered level of consciousness.
  `classification = deliriumPresent ? 'present' : 'absent'`. For the CAM-ICU
  variant, an unrousable patient (RASS −4/−5) yields `unableToAssess` and the
  algorithm is not evaluated.
- **Engine files:**
  - `types.ts` — `CamAssessment`, `CamResult`, `FlaggedIssue`, feature and enum
    types.
  - `cam-rules.ts` — the boolean feature predicates and the
    `1 AND 2 AND (3 OR 4)` diagnostic rule; CAM-ICU RASS gating.
  - `cam-grader.ts` — pure `gradeCam(data)` orchestrator returning the output
    shape above.
  - `flagged-issues.ts` — derives the prioritized flagged-issue list.
  - `utils.ts` — shared helpers (feature normalization, tri-state handling,
    positive-feature-set construction).
- **Tests:** `cam-grader.test.ts` (each satisfying and non-satisfying feature
  pattern plus the `unableToAssess` edge case), `cam-rules.test.ts`.

## Verify

```sh
bin/test-form confusion-assessment-method
bin/test-sql-apply confusion-assessment-method
bin/test-personas confusion-assessment-method
bin/test-e2e --html confusion-assessment-method
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
