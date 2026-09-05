---
name: arc42-maintainer-skill
description: "Implementation workflow for maintaining and extending the arc42 form (forms/arc42/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# arc42 — Maintainer Skill

Implementation-facing companion to `arc42-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/arc42/` contains:

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

- **Input shape:** `Arc42Documentation` TypeScript type containing prose fields
  directly on the top-level object plus child arrays:
  `businessGoals`, `qualityGoals`, `stakeholders`, `constraintItems`,
  `contextPartners`, `technologyDecisions`, `buildingBlocks`,
  `runtimeScenarios`, `deploymentNodes`, `crosscuttingConcepts`,
  `architecturalDecisions`, `qualityScenarios`, `riskItems`, `glossaryTerms`.

- **Output shape:**
  ```ts
  calculateMaturity(d: Arc42Documentation): {
    computedMaturity: 'Draft' | 'Reviewable' | 'Ready' | 'Mature';
    finalMaturity: 'Draft' | 'Reviewable' | 'Ready' | 'Mature';
    completenessBySection: Record<1|2|3|4|5|6|7|8|9|10|11|12,
                                  'empty' | 'partial' | 'complete'>;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```

- **Algorithm (max-grade):**
  1. Evaluate per-section completeness (`empty` / `partial` / `complete`) using
     the thresholds in `doc/completeness-rules.md`.
  2. Derive `computedMaturity` from the lowest completeness across all 12
     sections, checked against the four band drivers in `doc/maturity-rules.md`.
  3. Fire independent flags (high / medium / low priority) from
     `doc/maturity-rules.md`; flags do not alter the maturity calculation.
  4. Apply any author override from step 12 to produce `finalMaturity`.
  5. Store both `computedMaturity` and `finalMaturity`.

- **Engine files:**
  - `src/lib/grading/types.ts` — `Arc42Documentation` + sub-types
  - `src/lib/grading/utils.ts` — cardinality + completeness helpers
  - `src/lib/grading/completeness-rules.ts` — per-section completeness rules
  - `src/lib/grading/maturity-grader.ts` — `calculateMaturity()` pure function
  - `src/lib/grading/flagged-issues.ts` — `detectFlags()`
  - `src/lib/grading/completeness-rules.test.ts`
  - `src/lib/grading/maturity-grader.test.ts`

## Verify

```sh
bin/test-form arc42
bin/test-sql-apply arc42
bin/test-personas arc42
bin/test-e2e --html arc42
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
