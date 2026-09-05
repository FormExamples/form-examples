---
name: knee-replacement-surgery-evaluation-maintainer-skill
description: "Implementation workflow for maintaining and extending the Knee Replacement Surgery Evaluation form (forms/knee-replacement-surgery-evaluation/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Knee Replacement Surgery Evaluation — Maintainer Skill

Implementation-facing companion to `knee-replacement-surgery-evaluation-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/knee-replacement-surgery-evaluation/` contains:

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

- **Input shape:** `KneeReplacementSurgeryEvaluation` TypeScript type
  containing the 15 wizard sections plus clinician-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateKneeEvaluation(data: KneeReplacementSurgeryEvaluation): {
    oksItemScores: Record<string, number | null>;
    oksTotal: number;
    computedOksCategory: 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | '';
    finalOksCategory: 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | '';
    maxKellgrenLawrenceGrade: number | null;
    computedCandidacy: 'strong-candidate' | 'candidate' | 'continue-conservative' | 'not-indicated' | 'mdt-review' | '';
    finalCandidacy: 'strong-candidate' | 'candidate' | 'continue-conservative' | 'not-indicated' | 'mdt-review' | '';
    overrideReason: string;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** the OKS total and category are a straight sum and band
  lookup. The candidacy recommendation is a first-match-wins ordered rule
  list (see `oks-rules.ts` / `js/oks-rules.js`). Safety flags fire
  independently of the candidacy override.
- **Engine files (HTML):** `js/types.js`, `js/oks-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `oks-rules.ts`,
  `flagged-issues.ts`, `grader.ts`), with `grader.test.ts` asserting both
  sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Verify

```sh
bin/test-form knee-replacement-surgery-evaluation
bin/test-sql-apply knee-replacement-surgery-evaluation
bin/test-examples-conformance knee-replacement-surgery-evaluation
bin/lily-html-refactor --check knee-replacement-surgery-evaluation
bin/lily-svelte-refactor --check knee-replacement-surgery-evaluation
bin/test-personas knee-replacement-surgery-evaluation
bin/test-e2e --html knee-replacement-surgery-evaluation
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
