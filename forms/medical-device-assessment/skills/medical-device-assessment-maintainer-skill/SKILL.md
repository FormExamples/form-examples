---
name: medical-device-assessment-maintainer-skill
description: "Implementation workflow for maintaining and extending the Medical Device Assessment form (forms/medical-device-assessment/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Medical Device Assessment — Maintainer Skill

Implementation-facing companion to `medical-device-assessment-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/medical-device-assessment/` contains:

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

Pure function: assessment state in, `{ computedClass, classSuffix,
conformityRoute, firedRules, flags, readiness }` out. Highest class over all
fired rules wins. Rule table is in `index.md`. Never hand-edit generated
artefacts (`xml/`, `fhir/`, `protobuf/`, `openapi/`, `back-end-with-loco-setup`).

## Verify

```sh
bin/test-form medical-device-assessment
bin/test-sql-apply medical-device-assessment
bin/test-examples-conformance medical-device-assessment
bin/test-personas medical-device-assessment
bin/test-e2e --html medical-device-assessment
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
