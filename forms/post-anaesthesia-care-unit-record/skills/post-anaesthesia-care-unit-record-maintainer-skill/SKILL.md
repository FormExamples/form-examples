---
name: post-anaesthesia-care-unit-record-maintainer-skill
description: "Implementation workflow for maintaining and extending the Post-Anaesthesia Care Unit (PACU) Record form (forms/post-anaesthesia-care-unit-record/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Post-Anaesthesia Care Unit (PACU) Record — Maintainer Skill

Implementation-facing companion to `post-anaesthesia-care-unit-record-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/post-anaesthesia-care-unit-record/` contains:

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

- **Input shape:** `PacuRecord` TypeScript type — the five Aldrete parameter
  inputs, optional PADSS criterion inputs, airway/pain/PONV fields, plus context
  and identification fields.
- **Output shape:**
  ```ts
  gradePacu(data: PacuRecord): {
    activityScore: 0 | 1 | 2;
    respirationScore: 0 | 1 | 2;
    circulationScore: 0 | 1 | 2;
    consciousnessScore: 0 | 1 | 2;
    oxygenSaturationScore: 0 | 1 | 2;
    aldreteTotal: number;            // 0..10
    readinessBand: 'not-ready' | 'discharge-ready';
    padssTotal: number | null;       // 0..10 when day-surgery criteria supplied
    padssStreetFit: boolean | null;
    firedParameters: FiredParameter[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each Aldrete parameter contributes 0–2; the total
  0–10 determines the readiness band. Discharge-ready requires
  `aldreteTotal >= 9` **and** `oxygenSaturationScore === 2`. PADSS is summed
  independently when supplied (`padssStreetFit = padssTotal >= 9`). See spec §4.
  A missing parameter contributes 0 and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `aldrete-rules.ts`,
  `aldrete-grader.ts`, `flagged-issues.ts`.
- **Tests:** `aldrete-grader.test.ts`, `aldrete-rules.test.ts` — cover the
  discharge boundary (total 8/9), the SpO₂-gated discharge case (total 9 with
  oxygen-saturation score < 2 stays not-ready), every parameter's 0/1/2 levels,
  and the PADSS ≥ 9 boundary.

## Verify

```sh
bin/test-form post-anaesthesia-care-unit-record
bin/test-sql-apply post-anaesthesia-care-unit-record
bin/test-personas post-anaesthesia-care-unit-record
bin/test-e2e --html post-anaesthesia-care-unit-record
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
