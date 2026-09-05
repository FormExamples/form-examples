---
name: curb-65-pneumonia-severity-score-maintainer-skill
description: "Implementation workflow for maintaining and extending the CURB-65 Pneumonia Severity Score form (forms/curb-65-pneumonia-severity-score/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# CURB-65 Pneumonia Severity Score — Maintainer Skill

Implementation-facing companion to `curb-65-pneumonia-severity-score-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/curb-65-pneumonia-severity-score/` contains:

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

- **Input shape:** `Curb65Assessment` TypeScript type mirroring the SQL schema —
  encounter/clinician identification, patient identifier, date of birth, sex,
  and the raw criterion inputs.
- **Output shape:**
  ```ts
  calculateCurb65(data: Curb65Assessment): {
    curb65Score: 0 | 1 | 2 | 3 | 4 | 5;
    crb65Score: 0 | 1 | 2 | 3 | 4 | null; // populated when urea not measured
    criteria: {
      confusion: boolean;
      urea: boolean;
      respiratoryRate: boolean;
      bloodPressure: boolean;
      ageOver65: boolean;
    };
    riskBand: 'low' | 'intermediate' | 'high';
    recommendedDisposition:
      | 'home-outpatient'
      | 'short-stay-supervised'
      | 'hospital-admission';
    firedFlags: FiredFlag[];
  }
  ```
- **Algorithm:** one point each for Confusion (new), Urea > 7 mmol/L,
  Respiratory rate ≥ 30, Blood pressure (systolic < 90 or diastolic ≤ 60), and
  age ≥ 65; sum is 0–5. Band: 0–1 low, 2 intermediate, 3–5 high. Missing inputs
  score 0 and raise `incomplete-criterion`. When `ureaMeasured === false`,
  compute CRB-65 (0–4) and band it 0 low / 1–2 intermediate / 3–4 high. Pure
  function — no side effects, no I/O.
- **Engine files:**
  - `types.ts` — `Curb65Assessment`, `Curb65Result`, `FiredFlag`, enums.
  - `curb65-rules.ts` — the five criterion predicates and their thresholds.
  - `curb65-grader.ts` — `calculateCurb65()`; sums criteria, bands, disposition,
    CRB-65 fallback.
  - `flagged-issues.ts` — advisory flags (see §Flagged issues).
  - `utils.ts` — age-from-DOB derivation, unit coercion (BUN mg/dL → urea
    mmol/L), null-safe comparisons.
- **Tests:** `curb65-grader.test.ts`, `curb65-rules.test.ts` — cover every
  boundary (urea = 7 negative, RR = 30 positive, systolic = 90 negative,
  diastolic = 60 positive, age = 65 positive) and the CRB-65 fallback path.

## Verify

```sh
bin/test-form curb-65-pneumonia-severity-score
bin/test-sql-apply curb-65-pneumonia-severity-score
bin/test-personas curb-65-pneumonia-severity-score
bin/test-e2e --html curb-65-pneumonia-severity-score
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
