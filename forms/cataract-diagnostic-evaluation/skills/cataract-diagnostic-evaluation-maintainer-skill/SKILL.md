---
name: cataract-diagnostic-evaluation-maintainer-skill
description: "Implementation workflow for maintaining and extending the Cataract Diagnostic Evaluation form (forms/cataract-diagnostic-evaluation/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Cataract Diagnostic Evaluation — Maintainer Skill

Implementation-facing companion to `cataract-diagnostic-evaluation-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/cataract-diagnostic-evaluation/` contains:

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

- **Input shape:** `CataractDiagnosticEvaluation` TypeScript type containing
  the 15 wizard sections plus clinician-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateCataractEvaluation(data: CataractDiagnosticEvaluation): {
    locsIIISeverityRight: 'mild' | 'moderate' | 'severe' | '';
    locsIIISeverityLeft: 'mild' | 'moderate' | 'severe' | '';
    computedSurgicalCandidacy: 'not-indicated' | 'consider' | 'indicated' | 'urgent-referral' | '';
    finalSurgicalCandidacy: 'not-indicated' | 'consider' | 'indicated' | 'urgent-referral' | '';
    overrideReason: string;
    functionalImpactScore: number | null;    // 0..12 (three 0..4 sub-scores)
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** max-grade — the worse eye's LOCS III severity band and the
  worse of acuity/glare drive the computed surgical candidacy; safety flags
  fire independently and are never suppressed by a clinician override.
  `not-indicated` is the default when no rule fires.
- **Engine files (HTML):** `js/types.js`, `js/locs-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `locs-rules.ts`,
  `flagged-issues.ts`, `grader.ts`), with `grader.test.ts` asserting both
  sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Verify

```sh
bin/test-form cataract-diagnostic-evaluation
bin/test-sql-apply cataract-diagnostic-evaluation
bin/test-examples-conformance cataract-diagnostic-evaluation
bin/lily-html-refactor --check cataract-diagnostic-evaluation
bin/test-personas cataract-diagnostic-evaluation
bin/test-e2e --html cataract-diagnostic-evaluation
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
