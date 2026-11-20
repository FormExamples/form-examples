# United States Divorce Petition — Agent Instructions

A US documentation instrument for a petition for dissolution of marriage, the
decree and the vital-records divorce certificate. A single continuous wizard; the
engine is a **completeness and eligibility** engine, not a score: it classifies
the petition as **Ready to file**, **Incomplete**, or **Not yet eligible** and
raises flagged issues. Documentation support, not legal advice; the court
decides.

See [`index.md`](./index.md) and [`spec/index.md`](./spec/index.md).

## Directory map

- `./index.md`, `./AGENTS.md`, `./plan.md`, `./tasks.md`, `./CHANGELOG.md`
- `./spec/` living domain spec; `./doc/` research and citations
- `./sql/` PostgreSQL migrations (source of truth); `./xml/`, `./fhir/`,
  `./protobuf/`, `./openapi/` generated
- `./front-end-with-html/` wizard + dashboard (Lily); `./front-end-with-svelte/`
  SvelteKit wizard + dashboard; `./back-end-with-axum/` Rust JSON API
- `./examples/` fixtures and `personas.json`

## Validation engine

- **Input:** `DivorcePetition` (sections filing, spouses, children, property,
  service, decree).
- **Output:** `validatePetition(d)` returns `{ readinessClass: 'ready-to-file' |
  'incomplete' | 'not-yet-eligible', propertyRegime, earliestDecreeDate,
  stateRuleKnown }`; `detectFlaggedIssues(d)` returns the flags.
- **Algorithm:** first match wins: residency, separation or waiting-period
  shortfall gives `not-yet-eligible`; missing required items gives `incomplete`;
  otherwise `ready-to-file` (spec section 4).
- **Files (HTML):** `types.js`, `rules.js` (`STATE_RULES`, predicates),
  `grader.js`, `flags.js`, `form-app.js`. **Svelte:** `src/lib/engine/` ports
  with vitest tests. **Axum:** the crate stores records and grade rows.
- **State rules:** ten verified states in `STATE_RULES`; any other state falls
  back to `DEFAULT_RULE` and raises `F-DIV-UNKNOWN-STATE-001`. Change a rule in
  `doc/index.md` and the spec first, then in both engines.

## Conventions

- `''` for unanswered text and enum fields; `null` for unanswered numbers and
  dates. camelCase in JS/TS, snake_case in SQL. UUID keys, timestamps and soft
  delete on every table. Generated artefacts are never hand-edited.

## Verify

```sh
bin/test-form united-states-divorce-petition
bin/test-personas united-states-divorce-petition
bin/test-engines united-states-divorce-petition
```
