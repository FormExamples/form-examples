---
name: united-states-vehicle-title-and-registration-application-maintainer-skill
description: "Implementation workflow for maintaining and extending the United States Vehicle Title and Registration Application form (forms/united-states-vehicle-title-and-registration-application/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# United States Vehicle Title and Registration Application — Maintainer Skill

Implementation-facing companion to `united-states-vehicle-title-and-registration-application-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/united-states-vehicle-title-and-registration-application/` contains:

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-axum` | Rust + Axum JSON API |

Generated artefacts (`xml`, `fhir`, `protobuf`, `openapi`, the Axum setup script, `CHANGELOG.md`, `examples/assessment.json`) are never hand-edited — regenerate them instead; see the tool catalogue in [`/AGENTS.md`](../../../../AGENTS.md).

## Scoring engine

Not yet documented in this form's own `AGENTS.md`. See [`../../spec/index.md`](../../spec/index.md)
 for the scoring instrument and engine contract.

## Verify

```sh
bin/test-form united-states-vehicle-title-and-registration-application
bin/test-personas united-states-vehicle-title-and-registration-application
bin/test-engines united-states-vehicle-title-and-registration-application
bin/test-sql-apply united-states-vehicle-title-and-registration-application
bin/test-e2e --html united-states-vehicle-title-and-registration-application
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
