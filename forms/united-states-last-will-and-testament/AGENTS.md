# United States Last Will and Testament: Agent Instructions

A planning and validity-checking form for a United States will, as a single
continuous single-page wizard. The engine is a **completeness and
validity-classification** engine, not a numeric score: it classifies the plan as
**valid-ready-to-execute**, **incomplete**, or **formality-risk** and raises
prioritized flagged issues. It is documentation support, not legal advice.

See [`index.md`](./index.md) for the design, [`spec/index.md`](./spec/index.md)
for the living domain spec (state-rule table and flag catalogue), and
[`doc/index.md`](./doc/index.md) for the research and citations.

## Directory map

- `./index.md`, `./AGENTS.md`, `./plan.md`, `./tasks.md`, `./CHANGELOG.md`
- `./spec/`: living domain spec
- `./doc/`: statutory research, citations, and verification status
- `./sql/`: PostgreSQL schema (source of truth)
- `./xml/`, `./fhir/r5/`, `./protobuf/`, `./openapi/`: generated representations
- `./front-end-with-html/`: wizard (`index.html`) and drafter dashboard
- `./front-end-with-svelte/`: SvelteKit wizard and drafter dashboard
- `./back-end-with-axum/`: Rust axum + axa + sqlx JSON API
- `./examples/`: fixtures and `personas.json`

## Validation engine

- **Input shape:** `Will`, with sections `testator`, `family`, `estate`,
  `provisions`, `execution`, `selfProving`.
- **Output shape:**
  ```ts
  validateWill(w: Will): {
    validityClass: 'valid-ready-to-execute' | 'incomplete' | 'formality-risk';
    residuaryPercentTotal: number;
    electiveShareAmount: number | null;
    witnessCount: number;
    selfProved: boolean;
    federalEstateTaxExposure: boolean;
    stateRuleSource: 'state-table' | 'uniform-default';
  }
  detectFlaggedIssues(w: Will): FlaggedIssue[]   // split engine; the Svelte port also
                                                 // returns them from validateWill
  ```
- **Algorithm:** any high flag gives `formality-risk`; else any missing required
  answer gives `incomplete`; else `valid-ready-to-execute` (spec section 4).
- **HTML engine files:** `front-end-with-html/js/rules.js` (the `STATE_RULES`
  table and predicates), `grader.js`, `flags.js`, `types.js`.
- **Svelte engine files:** `src/lib/engine/` `will-rules.ts`, `will-grader.ts`,
  `flagged-issues.ts`, `types.ts`, `utils.ts`, and `will-grader.test.ts`, which
  reads `examples/personas.json` so the two engines cannot drift.
- **State rules:** keep `STATE_RULES` in `rules.js` and `will-rules.ts` identical;
  add a state by adding a row to both, to the spec table (section 4.1), to
  `doc/index.md`, and a persona.
- **Clock:** the engine never reads the wall clock; capacity compares the date of
  birth with the execution date.

## Conventions

- `''` for unanswered text and enum fields; `null` for unanswered numeric and date
  fields.
- camelCase in JavaScript and TypeScript; snake_case in SQL.
- Do not hand-edit generated artefacts (`xml/`, `fhir/`, `protobuf/`, `openapi/`,
  `back-end-with-axum-setup`).
- Money is US dollars; percentages are percent (0 to 100).

## Verify

```sh
bin/test-form united-states-last-will-and-testament
bin/test-sql-apply united-states-last-will-and-testament
bin/test-personas united-states-last-will-and-testament
bin/test-engines united-states-last-will-and-testament
bin/test-examples-conformance united-states-last-will-and-testament
bin/test-e2e --html united-states-last-will-and-testament
```

Compliance: documentation support, not legal advice; the probate court decides
validity. Update the spec before changing code.
