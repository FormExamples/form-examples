---
name: medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request-maintainer-skill
description: "Implementation workflow for maintaining and extending the Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request form (forms/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request — Maintainer Skill

Implementation-facing companion to `medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request/` contains:

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
bin/test-form medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
bin/test-sql-apply medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
bin/test-personas medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
bin/test-e2e --html medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
