---
name: united-states-property-tax-exemption-application-maintainer-skill
description: "Implementation workflow for maintaining and extending the United States Property Tax Exemption Application form (forms/united-states-property-tax-exemption-application/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# United States Property Tax Exemption Application — Maintainer Skill

Implementation-facing companion to `united-states-property-tax-exemption-application-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/united-states-property-tax-exemption-application/` contains:

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

- **Input:** `PropertyTaxApplication` - applicant, property, exemptions, income, documents, filing, appeal, declaration.
- **Output:** `gradeApplication(d)` returns `{ eligibilityClass, filingDeadline, filedLate, qualifyingExemptions, rules }`; `detectFlaggedIssues(d)` returns the flags (a split engine).
- **Classification:** likely-ineligible beats incomplete beats likely-eligible (spec section 4.2).
- **State rules:** edit `STATE_RULES` in `front-end-with-html/js/rules.js` and the Svelte port `src/lib/engine/rules.ts` together, update `spec/index.md` section 4.1 and `doc/index.md`, then `bin/test-personas united-states-property-tax-exemption-application --update`.

## Verify

```sh
bin/test-form united-states-property-tax-exemption-application
bin/test-sql-apply united-states-property-tax-exemption-application
bin/test-personas united-states-property-tax-exemption-application
bin/test-engines united-states-property-tax-exemption-application
bin/test-examples-conformance united-states-property-tax-exemption-application
bin/test-e2e --html united-states-property-tax-exemption-application
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
