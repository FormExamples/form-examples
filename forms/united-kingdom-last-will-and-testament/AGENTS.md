# United Kingdom Last Will and Testament — Agent Instructions

A will-drafting documentation instrument for England and Wales. Collects the
testator, the estate, executors, beneficiaries and shares, guardians and funeral
wishes, and the Wills Act 1837 signing and witnessing facts via a single
continuous single-page wizard. The engine is a **completeness and validity
engine**, not a numeric score: it classifies the will as **valid** (ready to
execute), **incomplete**, or **formality-risk**, and raises flagged issues.

**It is documentation support, not legal advice.** Every report and page says
so. Never describe a `valid` result as "legally valid".

See [`index.md`](./index.md) for the full design and
[`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — legal reference documentation (GOV.UK, Wills Act 1837, Inheritance
  Act 1975, inheritance tax)
- `./sql/` — PostgreSQL schema (source of truth)
- `./xml/`, `./fhir/`, `./protobuf/`, `./openapi/` — generated representations
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-axum/` — Rust axum + axa + sqlx JSON API
- `./examples/` — fixtures and `personas.json`

## Validation engine

- **Input shape:** `Will` — sections `testator`, `estate`, `executors`,
  `beneficiaries`, `family`, `execution` (see spec §3).
- **Output shape:**
  ```ts
  validateWill(data: Will): {
    validityClass: 'valid' | 'incomplete' | 'formality-risk';
    formalityRisk: boolean;
    sharesTotalPercent: number;
    witnessCount: number;
    flaggedIssues: FlaggedIssue[]; // TypeScript only; HTML composes flags.js
  }
  ```
- **Algorithm:** classification, not additive. Precedence: a formality problem
  gives `formality-risk`; else missing content gives `incomplete`; else `valid`.
  See spec §4.
- **HTML engine files:** `js/types.js`, `js/rules.js`, `js/grader.js`,
  `js/flags.js`. The grader returns no flags; `form-app.js` composes
  `detectFlaggedIssues(state)` at render time, so `examples/personas.json` pins
  the flags via `flagsHint` and `flagsArgs: ["state"]`.
- **Svelte engine files:** `src/lib/engine/types.ts`, `utils.ts`,
  `will-rules.ts`, `will-grader.ts`, `flagged-issues.ts`, with
  `will-grader.test.ts` (class precedence, witness rules, shares, and the persona
  oracle).
- The testator's age uses `dateOfWill` when set, else the current date, so
  tests freeze the clock.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for unanswered
  numeric and date fields.
- camelCase in TypeScript and JSON; snake_case in SQL and Rust internals.
- Four beneficiary, two executor and two witness slots, named with the ordinals
  `First` to `Fourth`, not digits, so camelCase maps to snake_case losslessly.
- Step components `Step1Testator` to `Step6Execution` in
  `src/lib/components/steps/`.
- UUIDv4 primary keys; `created_at`, `updated_at`, `deleted_at` on every table.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Axum setup) are never
  hand-edited.

## Legal grounding

- Wills Act 1837 s.7, s.9, s.15, s.18, s.18A; Inheritance (Provision for Family
  and Dependants) Act 1975; Administration of Estates Act 1925.
- GOV.UK *Make a will*, *Make sure your will is legal*, *Inheritance Tax*.
- Law Society guidance on wills and probate.

## Compliance

UK GDPR and the Data Protection Act 2018, WCAG 2.2 AA, ISO/IEC/IEEE 26514:2022.
Not a medical device; not a regulated legal service.

## Verify

```sh
bin/test-form united-kingdom-last-will-and-testament
bin/test-personas united-kingdom-last-will-and-testament
bin/test-engines united-kingdom-last-will-and-testament
bin/test-examples-conformance united-kingdom-last-will-and-testament
bin/test-e2e --html united-kingdom-last-will-and-testament
```
