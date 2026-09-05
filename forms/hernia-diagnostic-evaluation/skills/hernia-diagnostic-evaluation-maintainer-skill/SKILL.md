---
name: hernia-diagnostic-evaluation-maintainer-skill
description: "Implementation workflow for maintaining and extending the Hernia Diagnostic Evaluation form (forms/hernia-diagnostic-evaluation/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Hernia Diagnostic Evaluation — Maintainer Skill

Implementation-facing companion to `hernia-diagnostic-evaluation-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/hernia-diagnostic-evaluation/` contains:

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

- **Input shape:** `HerniaDiagnosticEvaluation` TypeScript type containing the
  14 wizard sections plus clinician-identification and patient-identification
  fields.
- **Output shape:**

  ```ts
  calculateHerniaEvaluation(data: HerniaDiagnosticEvaluation): {
    herniaType: HerniaType;
    herniaSubtype: InguinalSubtype | 'not-applicable' | '';
    ehsClassification: string;
    ehsSizeGrade: '1' | '2' | '3' | '';
    reducibilityStatus: ReducibilityStatus;
    computedUrgency: 'routine' | 'soon' | 'urgent' | 'emergency';
    finalUrgency: 'routine' | 'soon' | 'urgent' | 'emergency';
    overrideReason: string;
    recommendation: ManagementPlan;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** red-flag-first, not max-grade over a numeric total — any
  positive red flag in step 8 forces `computedUrgency` to `emergency` and is
  never diluted by the rest of the examination. `routine` is the default when
  nothing else fires.
- **Engine files (HTML):** `js/types.js`, `js/classification-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`,
  `classification-rules.ts`, `flagged-issues.ts`, `grader.ts`), with
  `grader.test.ts` asserting both sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Verify

```sh
bin/test-form hernia-diagnostic-evaluation
bin/test-sql-apply hernia-diagnostic-evaluation
bin/test-examples-conformance hernia-diagnostic-evaluation
bin/lily-html-refactor --check hernia-diagnostic-evaluation
bin/test-personas hernia-diagnostic-evaluation
bin/test-e2e --html hernia-diagnostic-evaluation
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
