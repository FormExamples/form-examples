---
name: eye-prescription-maintainer-skill
description: "Implementation workflow for maintaining and extending the Eye Prescription form (forms/eye-prescription/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Eye Prescription — Maintainer Skill

Implementation-facing companion to `eye-prescription-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/eye-prescription/` contains:

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

- **Input shape:** `EyePrescription` TypeScript type with `prescriber`,
  `patient`, `examination`, two `EyeRefraction` (right and left), one
  `VisualAcuity`, one `PupillaryDistance`, one `LensRecommendation`, optional
  `OcularHealthFinding`.
- **Output shape:**
  ```ts
  classifyPrescription(data: EyePrescription): {
    rightEyeClassification: RefractiveClass[]; // may include both sphere class and astigmatism class
    leftEyeClassification: RefractiveClass[];
    presbyopiaPresent: boolean;
    anisometropiaDiopters: number;            // |sphereOD - sphereOS|
    complexity: 'simple' | 'moderate' | 'complex';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** per-eye classification is a band lookup on sphere and a band
  lookup on cylinder; complexity uses the worst-of rule across both eyes.
- **Engine files:** `types.ts`, `utils.ts`, `refractive-rules.ts`,
  `complexity-grader.ts`, `flagged-issues.ts`.
- **Tests:** `complexity-grader.test.ts`, `refractive-rules.test.ts`,
  `flagged-issues.test.ts`.

## Verify

```sh
bin/test-form eye-prescription
bin/test-sql-apply eye-prescription
bin/test-personas eye-prescription
bin/test-e2e --html eye-prescription
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
