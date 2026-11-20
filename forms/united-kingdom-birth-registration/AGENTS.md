# United Kingdom Birth Registration — Agent Instructions

An administrative form for preparing to register a birth in England and Wales
(GOV.UK "Register a birth") and ordering the birth certificate (General Register
Office). It collects the child, the mother, the second parent and the basis for
recording them, the informant and identity evidence, and the certificate order
through a single continuous single-page wizard. The engine is a **completeness
and validity** engine, not a clinical score: it classifies the application as
**ready-to-submit**, **incomplete**, **needs-additional-evidence**, or
**out-of-scope**, and raises flagged issues.

See [`index.md`](./index.md) for the design and step table, and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md`, `./AGENTS.md`, `./plan.md`, `./tasks.md`
- `./spec/` — living domain spec
- `./doc/` — rule-to-source map (GOV.UK pages, Births and Deaths Registration Act 1953)
- `./sql/` — PostgreSQL schema (source of truth)
- `./xml/`, `./fhir/`, `./protobuf/`, `./openapi/` — generated representations
- `./front-end-with-html/` — HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — SvelteKit wizard + dashboard (Lily)
- `./back-end-with-axum/` — Rust axum + axa + sqlx JSON API
- `./examples/` — fixtures, `personas.json`, FHIR bundle

## Validation engine

- **Input shape:** `BirthRegistration`: `child`, `mother`, `parentage`,
  `informant`, `certificate`.
- **Output shape:**
  ```ts
  validateRegistration(data): {
    readinessClass: 'ready-to-submit' | 'incomplete' | 'needs-additional-evidence' | 'out-of-scope';
    daysSinceBirth: number | null;
    lateRegistration: 'yes' | 'no' | '';
    missingItemCount: number;
  }
  detectFlaggedIssues(data): FlaggedIssue[]
  ```
- **Algorithm:** classification, not additive. Precedence: out-of-scope, then
  incomplete (missing items or inconsistent dates), then
  needs-additional-evidence (informant, paternity route or evidence, identity,
  more than 12 months), else ready-to-submit. See spec section 4.
- **HTML engine files** (`front-end-with-html/js/`): `types.js`, `rules.js`,
  `grader.js`, `flags.js`. **Svelte engine files** (`src/lib/engine/`):
  `types.ts`, `rules.ts`, `grader.ts`, `flagged-issues.ts`, with
  `grader.test.ts`. The two must agree; `examples/personas.json` pins the HTML
  engine.
- Days are whole UTC days from `dateOfBirth` to `registrationDate`; the engine
  never reads the wall clock.

## Conventions

- `''` for unanswered text and enum fields; `null` for unanswered numeric, date
  and time fields.
- camelCase in JS/TS; snake_case in SQL; UUIDv4 primary keys.
- Generated artifacts (XML, FHIR, protobuf, OpenAPI, Axum setup) are never
  hand-edited.
- Update `spec/index.md` before changing the rules.

## Compliance

Administrative tool; not legal advice and not a medical device. The registrar's
register entry is the legal record. See `spec/index.md` section 9 for the
assumptions to confirm.

## Verify

```sh
bin/test-form united-kingdom-birth-registration
bin/test-personas united-kingdom-birth-registration
bin/test-engines united-kingdom-birth-registration
bin/test-examples-conformance united-kingdom-birth-registration
bin/test-e2e --html united-kingdom-birth-registration
```
