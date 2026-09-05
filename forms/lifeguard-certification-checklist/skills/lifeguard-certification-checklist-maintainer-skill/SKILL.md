---
name: lifeguard-certification-checklist-maintainer-skill
description: "Implementation workflow for maintaining and extending the Lifeguard Certification Checklist form (forms/lifeguard-certification-checklist/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Lifeguard Certification Checklist — Maintainer Skill

Implementation-facing companion to `lifeguard-certification-checklist-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/lifeguard-certification-checklist/` contains:

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

- **Instrument**: Lifeguard Competency Verification Checklist (RLSS NPLQ / ILSF-aligned)
- **Range**: Pass / Fail / Needs Development
- **Critical competencies** (any failure → Fail): timed swim, unconscious-casualty rescue, spinal handling, CPR with compressions to depth/rate, AED delivery, scanning effectiveness
- **Engine files**: `types.ts`, `lifeguard-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `lifeguard-grader.test.ts`

## Verify

```sh
bin/test-form lifeguard-certification-checklist
bin/test-sql-apply lifeguard-certification-checklist
bin/test-personas lifeguard-certification-checklist
bin/test-e2e --html lifeguard-certification-checklist
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
