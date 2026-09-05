---
name: patient-reported-outcome-measures-maintainer-skill
description: "Implementation workflow for maintaining and extending the Patient-Reported Outcome Measures form (forms/patient-reported-outcome-measures/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Patient-Reported Outcome Measures — Maintainer Skill

Implementation-facing companion to `patient-reported-outcome-measures-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/patient-reported-outcome-measures/` contains:

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

```ts
computeSf36(data: Sf36Response): {
  pf: number|null; rp: number|null; bp: number|null; gh: number|null;
  vt: number|null; sf: number|null; re: number|null; mh: number|null;
  pcsApprox: number|null; mcsApprox: number|null;
}
computeNdi(data: NdiResponse): { rawScore: number; answeredSections: number; percentageScore: number|null; band: 'no-disability'|'mild'|'moderate'|'severe'|'complete'|'' }
computeMjoa(data: MjoaResponse): { totalScore: number|null; band: 'mild'|'moderate'|'severe'|'' }
computeEq5d(data: Eq5dResponse): { healthStateDescriptor: string; ukIndexValue: number|null; vasScore: number|null }
```

All four are pure functions, no side effects. See
[`spec/index.md`](./spec/index.md) for the exact recode tables,
domain-to-item mappings, and band thresholds — **implement exactly as
documented there**, including the explicit note that SF-36
`pcsApprox`/`mcsApprox` are non-licensed simplified approximations,
not the trademarked QualityMetric norm-based PCS/MCS.

- **Engine files:** `types.ts`, `sf36-rules.ts`, `ndi-rules.ts`,
  `mjoa-rules.ts`, `eq5d-rules.ts`, `factory.ts`.
- **Tests:** one test file per instrument, each with at least: an
  all-best-answers case, an all-worst-answers case, and one
  partially-answered case. For EQ-5D specifically, test the "11111"
  state → index exactly 1.0, and at least one state with a level-3
  dimension to confirm the N3 term applies.

## Verify

```sh
bin/test-form patient-reported-outcome-measures
bin/test-sql-apply patient-reported-outcome-measures
bin/test-personas patient-reported-outcome-measures
bin/test-e2e --html patient-reported-outcome-measures
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
