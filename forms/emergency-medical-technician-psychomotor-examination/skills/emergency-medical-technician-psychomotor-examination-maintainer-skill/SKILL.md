---
name: emergency-medical-technician-psychomotor-examination-maintainer-skill
description: "Implementation workflow for maintaining and extending the Emergency Medical Technician Psychomotor Examination form (forms/emergency-medical-technician-psychomotor-examination/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Emergency Medical Technician Psychomotor Examination — Maintainer Skill

Implementation-facing companion to `emergency-medical-technician-psychomotor-examination-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/emergency-medical-technician-psychomotor-examination/` contains:

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

- **Instrument**: NREMT Psychomotor Skills Examination
- **Range**: Pass / Fail with critical-criteria overrides
- **Categories**:
  - Pass: Minimum point threshold met and no critical-criteria failure
  - Fail: Any critical-criteria failure OR insufficient points
- **Critical criteria** (any → Fail): PPE precautions, scene safety, oxygen therapy, airway/breathing/shock management, transport urgency decision, dangerous intervention, spinal protection when indicated, 15-minute transport call
- **Engine files**: `types.ts`, `psychomotor-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `psychomotor-grader.test.ts`

## Verify

```sh
bin/test-form emergency-medical-technician-psychomotor-examination
bin/test-sql-apply emergency-medical-technician-psychomotor-examination
bin/test-personas emergency-medical-technician-psychomotor-examination
bin/test-e2e --html emergency-medical-technician-psychomotor-examination
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
