---
name: structured-medication-review-maintainer-skill
description: "Implementation workflow for maintaining and extending the Structured Medication Review (SMR) form (forms/structured-medication-review/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Structured Medication Review (SMR) — Maintainer Skill

Implementation-facing companion to `structured-medication-review-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/structured-medication-review/` contains:

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

- **Input shape:** `SmrReview` TypeScript type — the review context and
  identification fields, problems / goals / plan fields, and a repeating
  `medicines: SmrMedicine[]` list.
- **Output shape:**
  ```ts
  gradeSmr(data: SmrReview): {
    medicineCount: number;
    regularMedicineCount: number;
    anticholinergicBurdenScore: number;      // sum of per-medicine ACB points
    polypharmacyBand: 'none' | 'polypharmacy' | 'hyperpolypharmacy';
    anticholinergicBand: 'low' | 'significant';
    burdenBand: 'low' | 'moderate' | 'high';
    reviewStatus: 'complete' | 'incomplete';
    stopFlags: StoppFlag[];
    startFlags: StartFlag[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** documentation with partial scoring. Sum each medicine's
  anticholinergic burden points (0–3) into `anticholinergicBurdenScore`; count
  regular medicines into `regularMedicineCount`. `burdenBand` is the worse of the
  polypharmacy band (`none` < 5, `polypharmacy` 5–9, `hyperpolypharmacy` ≥ 10) and
  the anticholinergic band (`significant` when ACB ≥ 3) — a max-band rule.
  `reviewStatus` is `complete` only when every required section is filled (see
  spec §4). STOPP / START flags are one per fired criterion. See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `smr-rules.ts`, `smr-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `smr-grader.test.ts`, `smr-rules.test.ts` — cover the polypharmacy
  boundaries (4/5, 9/10 regular medicines), the ACB boundary (2/3), the composite
  burden band, review-status completeness, and every flagged issue.

## Verify

```sh
bin/test-form structured-medication-review
bin/test-sql-apply structured-medication-review
bin/test-personas structured-medication-review
bin/test-e2e --html structured-medication-review
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
