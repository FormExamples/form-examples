---
name: perioperative-optimization-maintainer-skill
description: "Implementation workflow for maintaining and extending the Perioperative Optimization form (forms/perioperative-optimization/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Perioperative Optimization — Maintainer Skill

Implementation-facing companion to `perioperative-optimization-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/perioperative-optimization/` contains:

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

- **Input shape:** `PerioperativeOptimization`, one section per wizard step.
- **Output shape:**

  ```ts
  calculateOptimization(data: PerioperativeOptimization): {
    weeksToSurgery: number | null;
    domains: DomainResult[];          // one per domain, in DOMAIN_ORDER
    computedReadiness: 'ready' | 'optimization-in-progress'
                     | 'optimization-required' | 'defer-surgery';
    finalReadiness: 'ready' | 'optimization-in-progress'
                  | 'optimization-required' | 'defer-surgery';
    overrideReason: string;
    gateDecision: GateDecision;
    mustScore: number | null;         // 0..6
    auditCScore: number | null;       // 0..12
    stopBangScore: number | null;     // 0..8
    dasiScore: number | null;
    friedPhenotypeScore: number | null;  // 0..5
    friedFrailtyCategory: 'robust' | 'pre-frail' | 'frail' | '';
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }

  interface DomainResult {
    domain: DomainKey;
    status: 'optimized' | 'in-progress' | 'action-required'
          | 'insufficient-time' | 'not-applicable';
    triggered: boolean;
    leadTimeWeeks: number;
    weeksShortfall: number | null;    // positive when time is short
    finding: string;
    intervention: string;
  }
  ```

- **Algorithm:** per-domain trigger → gate on time → max-grade composite. The
  worst domain sets the readiness band. Safety flags fire independently.
- **Engine files (HTML):** `js/types.js`, `js/domain-rules.js` (also exports
  `computeFriedPhenotypeScore()`), `js/gating.js`, `js/composite-grader.js`,
  `js/flagged-issues.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `domain-rules.ts`,
  `gating.ts`, `flagged-issues.ts`, `grader.ts`), with `grader.test.ts`.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()`. Both the
  assessment date and the planned surgery date come from the data, so
  `weeksToSurgery` is derived from recorded values and the function is
  deterministic.

## Verify

```sh
bin/test-form perioperative-optimization
bin/test-sql-apply perioperative-optimization
bin/test-examples-conformance perioperative-optimization
bin/lily-html-refactor --check perioperative-optimization
bin/test-personas perioperative-optimization
bin/test-e2e --html perioperative-optimization
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
