---
name: united-states-vehicle-bill-of-sale-maintainer-skill
description: "Implementation workflow for maintaining and extending the United States Vehicle Bill of Sale form (forms/united-states-vehicle-bill-of-sale/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# United States Vehicle Bill of Sale — Maintainer Skill

Implementation-facing companion to `united-states-vehicle-bill-of-sale-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/united-states-vehicle-bill-of-sale/` contains:

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

A completeness and risk-classification engine, not a numeric score. The HTML
engine is the reference: `rules.js` (predicates, `STATE_RULES`, VIN check digit,
odometer exemption), `grader.js` (`validateBillOfSale` returns the class plus
`odometerExempt` and `stateRuleKnown`), `flags.js` (`detectFlaggedIssues`, 18
flags). The Svelte engine in `front-end-with-svelte/src/lib/engine/` is a
TypeScript port with vitest tests that also run every persona. Keep
`createDefaultBillOfSale()` in `engine/defaults.ts`, not in the
`$app/environment`-importing store.

## Verify

```sh
bin/test-form united-states-vehicle-bill-of-sale
bin/test-personas united-states-vehicle-bill-of-sale
bin/test-engines united-states-vehicle-bill-of-sale
bin/test-examples-conformance united-states-vehicle-bill-of-sale
bin/test-sql-apply united-states-vehicle-bill-of-sale
bin/test-e2e --html united-states-vehicle-bill-of-sale
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
