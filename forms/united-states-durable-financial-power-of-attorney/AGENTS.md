# United States Durable Financial Power of Attorney — Agent Instructions

A United States execution-readiness checker for a durable power of attorney for
property and finances. A completeness / validity / eligibility engine, not a
score: it classifies the form as `ready-to-execute`, `incomplete`, or
`execution-risk` against the governing state's rule (UPOAA baseline plus a
`STATE_RULES` table for CA, NY, TX, FL, IL, PA, OH, WA) and raises flagged
issues. Documentation support, not legal advice.

See [`index.md`](./index.md) and [`spec/index.md`](./spec/index.md).

## Directory map

- `./spec/` living spec; `./doc/` statute research and citations
- `./sql/` source of truth; `./xml/ ./fhir/ ./protobuf/ ./openapi/` generated
- `./front-end-with-html/`, `./front-end-with-svelte/` wizard + dashboard
- `./back-end-with-axum/` JSON API; `./examples/` fixtures and `personas.json`

## Validation engine

HTML engine in `front-end-with-html/js/`: `rules.js` (`STATE_RULES`, predicates),
`grader.js` (`validateInstrument`), `flags.js` (`detectFlaggedIssues`),
`types.js`. Svelte port in `front-end-with-svelte/src/lib/engine/` with Vitest.
Split engine: the grader returns the class; `form-app.js` calls
`detectFlaggedIssues(state)` separately.

## Validity classes

`execution-risk` (answered item contradicts the state rule) over `incomplete`
(core item unanswered) over `ready-to-execute`. Unanswered never creates a risk.

## Flagged issues

See spec section 5. Unknown states fall back to the uniform default and raise
`F-STATE-RULE-VERIFY-001`.

## Conventions

`''` unanswered text/enum, `null` unanswered number/date; camelCase JS, snake_case
SQL; Oxford -ize spelling. State rules must be re-verified against current
statutes; see `doc/state-rules.md` for the confidence of each row.

## Verify

```sh
bin/test-form united-states-durable-financial-power-of-attorney
bin/test-personas united-states-durable-financial-power-of-attorney
```
