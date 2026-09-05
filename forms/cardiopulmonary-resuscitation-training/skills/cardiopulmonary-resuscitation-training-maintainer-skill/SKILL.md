---
name: cardiopulmonary-resuscitation-training-maintainer-skill
description: "Implementation workflow for maintaining and extending the Cardiopulmonary Resuscitation Training form (forms/cardiopulmonary-resuscitation-training/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Cardiopulmonary Resuscitation Training — Maintainer Skill

Implementation-facing companion to `cardiopulmonary-resuscitation-training-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/cardiopulmonary-resuscitation-training/` contains:

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

- **Instrument**: AHA BLS Skills Verification Checklist
- **Range**: Pass / Fail
- **Categories**:
  - Pass: All required skills demonstrated, no critical-action failure
  - Fail: Any critical-action failure OR >2 non-critical deficiencies
- **Critical actions**: compressions to BLS-standard rate (100-120/min) and depth (5-6 cm), effective ventilations, AED delivery without unsafe contact
- **Engine files**: `types.ts`, `bls-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `bls-grader.test.ts`

## Verify

```sh
bin/test-form cardiopulmonary-resuscitation-training
bin/test-sql-apply cardiopulmonary-resuscitation-training
bin/test-personas cardiopulmonary-resuscitation-training
bin/test-e2e --html cardiopulmonary-resuscitation-training
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
