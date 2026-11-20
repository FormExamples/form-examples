# United Kingdom Divorce Application - Agent Instructions

A completeness and time-gate checker for a divorce (or civil-partnership
dissolution) application in England and Wales under the Divorce, Dissolution and
Separation Act 2020: the application (D8 or online), the conditional order (D84)
and the final order (D36). A single continuous single-page wizard collects the
facts. The engine is a **completeness and validity** engine, not a score: it
classifies the application as **Ready to apply**, **Incomplete**, or **Not
eligible yet** and raises flagged issues.

See [`index.md`](./index.md) for the design, [`spec/index.md`](./spec/index.md)
for the living spec and [`doc/index.md`](./doc/index.md) for the cited rules.

## Directory map

- `./index.md` - project overview
- `./spec/` - living domain spec
- `./plan.md`, `./tasks.md` - roadmap and task tracking
- `./doc/` - legal and procedural references
- `./sql/` - PostgreSQL migrations (source of truth)
- `./xml/`, `./fhir/`, `./protobuf/`, `./openapi/` - generated representations
- `./front-end-with-html/` - HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` - SvelteKit wizard + dashboard (Lily)
- `./back-end-with-axum/` - Rust axum + axa + sqlx JSON API

## Validation engine

- **Input shape:** `DivorceApplication` with sections `application`,
  `marriage`, `jurisdiction`, `parties`, `children`, `finances`, `progress`.
- **Output shape:**
  ```ts
  validateApplication(s: DivorceApplication): {
    applicationClass: 'ready-to-apply' | 'incomplete' | 'not-eligible-yet';
    earliestEligibleDate: string;   // '' when no gate applies
    jurisdictionMet: boolean;
    rules: FiredRule[];
  }
  detectFlaggedIssues(s): FlaggedIssue[]   // split engine, called by form-app.js
  ```
- **Algorithm:** first match wins. The stage gate not met gives
  `not-eligible-yet`; any fired readiness rule gives `incomplete`; otherwise
  `ready-to-apply`. All dates are tested against `application.asOfDate`.
- **HTML engine files:** `types.js`, `rules.js`, `grader.js`, `flags.js`.
  **Svelte:** `src/lib/engine/` mirrors them in TypeScript with Vitest tests.

## Application classes and flags

See [`spec/index.md`](./spec/index.md) sections 4 and 5.

## Conventions

- `''` for unanswered text and enum fields; `null` for unanswered numeric and
  date fields. camelCase in JavaScript and TypeScript, snake_case in SQL.
- Generated artefacts are never hand-edited.

## Verify

```sh
bin/test-form united-kingdom-divorce-application
bin/test-personas united-kingdom-divorce-application
```
