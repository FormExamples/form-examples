---
name: organ-donation-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Organ Donation Assessment form (forms/organ-donation-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Organ Donation Assessment — Maintainer Skill

Implementation-facing companion to `organ-donation-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/organ-donation-assessment/` contains:

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

## Scoring system

- **Instrument**: Donor Risk Index + Organ-Specific Suitability Scoring
- **Eligibility categories**:
  - Suitable: ideal donor, meets all criteria
  - Conditionally suitable: expanded criteria donor, acceptable with additional evaluation
  - Unsuitable: absolute contraindications present
- **Risk levels**:
  - Low: ideal donor profile
  - Moderate: expanded criteria donor
  - High: marginal organ function
  - Critical: contraindicated
- **Engine files**: `types.ts`, `donation-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `donation-grader.test.ts`

## Verify

```sh
bin/test-form organ-donation-assessment
bin/test-sql-apply organ-donation-assessment
bin/test-personas organ-donation-assessment
bin/test-e2e --html organ-donation-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
