# United States Social Security Card Application (Form SS-5) - Agent Instructions

A United States federal administrative form: the application for an original,
replacement, or corrected Social Security card. The engine is a **completeness
and eligibility** engine, not a numeric score: it classifies the application as
**ready-to-submit**, **incomplete**, **evidence-missing**, or **not-eligible**,
and raises flagged issues. The Social Security number is never collected.

See [`index.md`](./index.md) for the design and [`spec/index.md`](./spec/index.md)
for the living domain spec.

## Directory map

- `./index.md` - project overview
- `./AGENTS.md` - this file
- `./spec/` - living domain spec
- `./plan.md`, `./tasks.md` - roadmap and task tracking
- `./doc/` - research and citations (SS-5, 20 CFR 422.103 and 422.107, POMS)
- `./sql/` - PostgreSQL migrations (source of truth); the main table is `ss5_application`
- `./xml/`, `./fhir/`, `./protobuf/`, `./openapi/` - generated; never hand-edit
- `./front-end-with-html/` - Lily wizard + dashboard
- `./front-end-with-svelte/` - SvelteKit wizard + dashboard
- `./back-end-with-axum/` - Rust axum + axa JSON API

## Validation engine

- **Input shape:** `SocialSecurityApplication` with sections `request`,
  `applicant`, `evidence`, `filer`, `tellSsa`.
- **Output:** `validateApplication(d)` returns `{ applicationClass,
  missingEvidenceCount, replacementLimitReached }`; `detectFlaggedIssues(d)`
  returns the flags (a split engine).
- **Algorithm:** first match wins: deceased or a replacement limit with no
  supported exception -> `not-eligible`; blank required fields, a mailed
  original for age 12 or older, or a bad minor signer -> `incomplete`; evidence
  gaps -> `evidence-missing`; else `ready-to-submit`. See spec section 4.
- **HTML engine:** `js/rules.js`, `js/grader.js`, `js/flags.js`, `js/types.js`.
- **Svelte engine:** `src/lib/engine/` (a TypeScript port with Vitest tests).
- **Federal only:** no `STATE_RULES`; `stateOfResidence` is validated against
  USPS codes and raises only a low flag.

## Conventions

- Empty string for unanswered text and enums; `null` for unanswered numbers and dates.
- Never add a Social Security number field.
- Oxford `-ize` spelling in prose.

## Compliance

Documentation support, not legal advice; SSA decides every application.

## Verify

```sh
bin/test-form united-states-social-security-card-application
bin/test-personas united-states-social-security-card-application
bin/test-engines united-states-social-security-card-application
bin/test-examples-conformance united-states-social-security-card-application
bin/test-e2e --html united-states-social-security-card-application
```
