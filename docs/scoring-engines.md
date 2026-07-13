# Scoring engines

Every form has a **pure** grading engine: given a filled assessment it returns a
grade, the audit trail of rules that fired, and any safety flags — with **no side
effects, no I/O, no network**. The same logic is implemented three times (vanilla
JS, TypeScript, Rust) and kept in agreement by shared golden vectors.

This mirrors the data model: the engine's output is exactly what lands in the
`<slug>_grade`, `<slug>_grade_rule`, and `<slug>_grade_flag` tables — see
[Data model](data-model.md).

## The pattern

An engine is decomposed into one small file per concern:

- **types** — the input assessment type, the enums (mirroring the SQL `CHECK`
  lists), the grading-result type, and the fired-rule / flag types.
- **one file per rule family** — each returns the rules it fires without mutating
  shared state.
- **flagged-issues** — the independent safety red flags (priority high / medium /
  low).
- **a grader** — the orchestrator that runs the rule families, assembles the
  grade, and returns the result.
- **utils** — small shared pure helpers.

The invariant across all three implementations: **same rule IDs, same flag IDs,
same output shape** (spec.md §3.2). The least-alarming band is chosen only when
no rule fires; a red flag escalates the result regardless of the other axes.

## Worked example: `cardiology-request`

This form is a four-axis referral vetting engine (appropriateness, safety,
completeness, triage). The Svelte engine lives in
`forms/cardiology-request/front-end-with-svelte/src/lib/engine/`:

```
types.ts                  input + result types, enums mirroring SQL CHECKs
appropriateness-rules.ts  Axis A
safety-rules.ts           Axis B (red flags)
completeness-rules.ts     Axis C
triage-rules.ts           Axis D
flagged-issues.ts         detectFlags()
grader.ts                 calculateGrade() — orchestrator, no side effects
utils.ts                  shared helpers
grader.test.ts            vitest tests over the golden vectors
```

`calculateGrade(request)` runs each axis, collects a `firedRules[]` audit trail
and the safety flags, and returns a single `GradingResult`. Its doc comment
states the contract explicitly: "No side effects, no network calls, no I/O."

## The same logic, three languages

The three implementations share structure and identifiers:

| Concern | HTML (`front-end-with-html/js/`) | Svelte (`src/lib/engine/`) | Rust (`back-end-with-loco/.../engine/`) |
|---------|----------------------------------|----------------------------|------------------------------------------|
| types | `types.js` | `types.ts` | `types.rs` |
| rules | `rules.js` | `*-rules.ts` (one per family) | `*_rules.rs` |
| flags | `flags.js` | `flagged-issues.ts` | `flagged_issues.rs` |
| grader | `grader.js` | `grader.ts` | `composite_grader.rs` (or `<form>_grader.rs`) |

The HTML front-end's `js/` also holds the non-engine glue (`form-app.js`,
`dashboard-app.js`, `data.js`, `api.js`) — the engine files are the ones that
must match the other stacks. The Rust engine is a plain module under the crate's
`src/<form_snake_case>/engine/` (see [Back end](back-end.md)); it is pure Rust
with no database access, called by the controllers after deserialising a request.

## Keeping them in agreement: golden vectors

The source of truth for engine behaviour is the shared fixture set. Each form's
`examples/assessment.json` is a filled form; the expected grade is the golden
output. All three implementations must reproduce it:

- **Svelte** — `grader.test.ts` runs under **vitest** (`vitest run`), part of the
  sharded Svelte CI matrix.
- **Rust** — engine unit tests under `cargo test`, part of the sharded Rust CI
  matrix; the crate also has `tests/engine/`.
- **Examples conformance** — `bin/test-examples-conformance` checks that every
  entity/property in `examples/assessment.json` maps to a real SQL
  table/column, so the golden input can never drift from the schema.

Because all three read the same fixtures and assert the same rule and flag IDs, a
divergence in any one implementation fails a gate. See
[Verification](verification.md) for the full CI picture, and
[`CONTRIBUTING.md`](../CONTRIBUTING.md) for running the tests locally.
